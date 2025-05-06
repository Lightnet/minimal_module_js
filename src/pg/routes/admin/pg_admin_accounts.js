/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { getPool } from '../../db/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg_auth.js';

const route = new Hono({ 
  // strict: false 
});

route.get('/accounts', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users');
    const users = result.rows;
    return c.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.stack);
    return c.json({ error: 'error logs' }, 500);
  }
});

export default route;