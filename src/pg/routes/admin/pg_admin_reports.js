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

// Get reports
route.get('/report', authenticate, async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM reports');
    const reports = result.rows;
    return c.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// Create report
route.post('/report', authenticate, async (c) => {
  const { title, reason, resource_type, resource_id } = await c.req.json();
  console.log('data:', { title, reason, resource_type, resource_id });

  try {
    const user = c.get('user');
    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO reports (reporter_id, resource_type, resource_id, title, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.id, resource_type, resource_id, title, reason]
    );
    console.log('Insert result:', result.rows[0]);
    return c.json({ api: 'CREATED' }, 201);
  } catch (error) {
    console.error('Error creating report:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// Update report (incomplete in original)
route.put('/report', authenticate, async (c) => {
  const data = await c.req.json();
  console.log('data:', data);
  // Note: Original code is incomplete; adding placeholder response
  return c.json({ api: 'UPDATE NOT IMPLEMENTED' }, 501);
});

// Delete report
route.delete('/report/:id', authenticate, async (c) => {
  console.log('DELETE REPORT...');
  try {
    const { id } = c.req.param();
    const pool = getPool();
    const result = await pool.query('DELETE FROM reports WHERE id = $1', [id]);
    console.log('Delete result:', result.rowCount);
    return c.json({ api: 'DELETE' });
  } catch (error) {
    console.error('Error deleting report:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

export default route;