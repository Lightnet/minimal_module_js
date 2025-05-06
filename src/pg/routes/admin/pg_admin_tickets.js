/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { authenticate, authorize } from '../../middleware/pg_auth.js';
import { getPool } from '../../db/pg_pool.js';

const route = new Hono({ 
  // strict: false 
});

// Get tickets
route.get('/ticket', authenticate, async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM tickets');
    const tickets = result.rows;
    console.log('results:', tickets);
    return c.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// Create ticket
route.post('/ticket', authenticate, async (c) => {
  const { title, description, resource_type, resource_id, category } = await c.req.json();
  console.log('data:', { title, description, resource_type, resource_id, category });

  try {
    const user = c.get('user');
    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO tickets (reporter_id, resource_type, resource_id, title, description, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.id, resource_type, resource_id, title, description, category]
    );
    console.log('Insert result:', result.rows[0]);
    return c.json({ api: 'CREATED' }, 201);
  } catch (error) {
    console.error('Error creating ticket:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// Update ticket
route.put('/ticket/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();
  console.log('data:', { status });

  try {
    const user = c.get('user');
    const pool = getPool();
    if (status) {
      const result = await pool.query(
        'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      console.log('Update result:', result.rows[0]);
    }
    return c.json({ api: 'UPDATE' });
  } catch (error) {
    console.error('Error updating ticket:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// Delete ticket
route.delete('/ticket/:id', authenticate, async (c) => {
  try {
    const { id } = c.req.param();
    const pool = getPool();
    const result = await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
    console.log('Delete result:', result.rowCount);
    return c.json({ api: 'DELETE' });
  } catch (error) {
    console.error('Error deleting ticket:', error.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

export default route;