/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import jwt from 'jsonwebtoken';
import { checkPermission } from '../../models/sqlite/sqlite_user.js';
import { getCookie } from 'hono/cookie';

export async function authenticateToken(ctx, next) {

  const tokenCookie = getCookie(ctx, 'token');
  // console.log("tokenCookie: ",tokenCookie);
  if(tokenCookie){
    try {
      // var decoded = jwt.verify(tokenCookie, 'wrong-secret');
      var userToken = jwt.verify(tokenCookie, process.env.JWT_SECRET || 'SECRET');
      console.log("userToken]]>>>",userToken);
      ctx.set('user', userToken); // Store user in context
      return await next();
    } catch(err) {
      // err
      // await next();
      return c.json({ error: 'Unauthorized' }, 401);
    }
  }else{
    // await next();
    return c.json({ error: 'Invalid token' }, 401);
  }
  // return await next();
}

export function authenticate(ctx, next) {
  console.log(ctx);
  const authHeader = ctx.headers.authorization;
  console.log("authHeader: ", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ctx.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.set('user', decoded); // Store user in context
    return null;
  } catch (error) {
    return ctx.json({ error: 'Invalid token' }, 401);
  }
}

export function authorize(resourceType, resourceId, action) {
  
  return async (ctx, next) => {
    // console.log("[[ ctx ]]");
    console.log(ctx);
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

