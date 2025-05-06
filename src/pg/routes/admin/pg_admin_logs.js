/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg_auth.js';

const route = new Hono({ 
  // strict: false 
});

route.get('/api/admin/logs', authenticate, authorize('audit_logs', null, 'manage'), async (c) => {    
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM audit_logs');
    const logs = result.rows;
    return c.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error.stack);
    return c.json({ error: 'error logs' }, 500);
  }
});

export default route;