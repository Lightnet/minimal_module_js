/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg/pg_pool.js';

const route = new Hono();

// GET MESSAGES
route.get('/api/message', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM messages');
    const messages = result.rows;
    return c.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.stack);
    return c.json({ api: 'error' }, 500);
  }
});

// CREATE
route.post('/api/message', async (c) => {
  try {
    const { alias, subject, content } = await c.req.json();
    console.log('data: ', { alias, subject, content });

    if (!alias || !subject || !content) {
      throw new Error('Alias, subject, and content are required');
    }

    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO messages (to_username, subject, content) VALUES ($1, $2, $3) RETURNING *',
      [alias, subject, content]
    );

    return c.json({ api: 'CREATED', message: result.rows[0] }, 201);
  } catch (err) {
    console.error('Error creating message:', err.message);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// DELETE
route.delete('/api/message/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('ID: ', id);
    const pool = getPool();
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Message not found' }, 404);
    }

    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting message:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

export default route;