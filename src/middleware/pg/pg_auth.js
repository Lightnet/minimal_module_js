/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//import jwt from 'jsonwebtoken';
import { verify, decode } from 'hono/jwt'
import { checkPermission } from '../../models/pg/pg_user.js';
import { getCookie } from 'hono/cookie';

// Check for cookie and Bearer token
export async function authenticate(c, next) {
  // Check Authorization header (Bearer token)
  const authHeader = c.req.header('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to cookie
    const tokenCookie = getCookie(c, 'token');
    if (tokenCookie) {
      token = tokenCookie;
    }
  }

  // If no token found, return 401
  if (!token) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  try {
    // Verify token
    const decoded = await verify(token, process.env.JWT_SECRET || 'SECRET');
    console.log('decoded: ', decoded);

    // Fetch user from database
    const pool = getPool();
    const result = await pool.query('SELECT id, username, email, role, salt FROM users WHERE id = $1', [decoded.sub || decoded.userId]);
    const user = result.rows[0];

    if (!user) {
      return c.json({ error: 'User not found' }, 401);
    }

    c.set('user', user); // Store user in context
    return await next(); // Proceed to next middleware/route
  } catch (err) {
    console.error('Authentication error:', err.stack);
    return c.json({ error: 'Invalid token' }, 401);
  }
}

/*
export async function authenticate(c, next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];
    if (!user) {
      return c.json({ error: 'User not found' }, 401);
    }
    c.set('user', user);
    await next();
  } catch (err) {
    console.error('Authentication error:', err.stack);
    return c.json({ error: 'Invalid token' }, 401);
  }
}

*/


export function authorize(resourceType, resourceId, action) {  
  return async (ctx, next) => {
    // console.log("[[ ctx ]]");
    // console.log(ctx);
    // console.log("next",next);
    const user = ctx.get('user');
    // console.log("[authorize]",user);
    if (!user) return ctx.json({ error: 'Unauthorized' }, 401);
    const hasPermission = await checkPermission(user, resourceType, resourceId, action);
    if (!hasPermission) {
      console.log("Forbidden");
      // await next();
      return ctx.json({ error: 'Forbidden' }, 403);
    }
    // return await next();
    if(typeof next === 'function'){
      return await next();
    }
  };
}

