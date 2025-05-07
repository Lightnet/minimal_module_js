/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//import jwt from 'jsonwebtoken';
import { verify, decode } from 'hono/jwt'
import { checkPermission } from '../models/pg_user.js';
import { getCookie } from 'hono/cookie';
import { getPool } from '../db/pg_pool.js';

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
    console.log("tokenCookie",tokenCookie);
    if (tokenCookie) {
      token = tokenCookie;
    }
  }

  // If no token found, return 401
  if (!token) {
    console.log("Unauthorized: No token provided");
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  try {
    // Verify token
    const decoded = await verify(token, process.env.JWT_SECRET || 'SECRET');
    // console.log('decoded: ', decoded);

    // Fetch user from database
    const pool = getPool();
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    // console.log(user);

    if (!user) {
      console.log("User not found");
      return c.json({ error: 'User not found' }, 401);
    }

    c.set('user', user); // Store user in context
    return await next(); // Proceed to next middleware/route
  } catch (err) {
    console.error('Authentication error:', err.stack);
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export function authorize(resourceType, resourceId, action) {  
  return async (ctx, next) => {
    // console.log("[[ ctx ]]");
    // console.log(ctx);
    // console.log("next",next);

    console.log("resourceType:", resourceType)
    console.log("resourceId:", resourceId)
    console.log("action:", action)
    console.log("=======================================================")


    const user = ctx.get('user');
    console.log("[authorize]",user);
    if (!user) return ctx.json({ error: 'Unauthorized' }, 401);

    const hasPermission = await checkPermission(user, resourceType, resourceId, action);
    console.log("hasPermission: ", hasPermission);
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

