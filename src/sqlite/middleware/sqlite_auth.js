/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { verify, decode } from 'hono/jwt'
import { checkPermission } from '../models/sqlite_user.js';
import { getCookie } from 'hono/cookie';

//check for cookie and Bearer
export async function authenticate(c, next) {
  // Check Authorization header (Bearer token)
  const authHeader = c.req.header('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to cookie
    const tokenCookie = getCookie(c, 'token');
    // const tokenCookie = getCookie(c, 'auth_token');
    // console.log("tokenCookie: ", tokenCookie);
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
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
    const decoded = await verify(token, process.env.JWT_SECRET || 'SECRET');
    // console.log("decoded: ", decoded);
    c.set('user', decoded); // Store user in context
    return await next(); // Proceed to next middleware/route
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export function authorize(resourceType, resourceId, action) {  
  return async (ctx, next) => {
    // console.log("[[ ctx ]]");
    // console.log(ctx);
    // console.log("next",next);
    // console.log("=======================================================")
    const user = ctx.get('user');
    // console.log("[ authorize -> ]",user);
    if (!user) return ctx.json({ error: 'Unauthorized' }, 401);
    // console.log("resourceType:", resourceType)
    // console.log("resourceId:", resourceId)
    // console.log("action:", action)
    // console.log("=======================================================")
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

