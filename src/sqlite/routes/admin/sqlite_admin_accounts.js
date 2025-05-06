/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { getDB } from '../../db/sqlite_db.js';
import { authenticate, authorize } from '../../middleware/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});

route.get('/accounts', async (c) => {
  try {
    const db = await getDB();
    const stmt = db.prepare('SELECT * FROM users');
    const groups = stmt.all();
    return c.json(groups);
  } catch (error) {
    return c.json({error:"error logs"})
  }
})

export default route;