/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg/pg_auth.js'; // Update to pg_auth.js

const route = new Hono();

// TOPIC GET (by board_id)
route.get('/api/topics/:id', authenticate, authorize('topic', null, 'read'), async (c) => {
  try {
    const pool = getPool();
    const id = c.req.param('id');
    console.log('BOARDS: ', id);
    const result = await pool.query('SELECT * FROM topics WHERE board_id = $1', [id]);
    const topics = result.rows;
    console.log('TOPICS:', topics);
    return c.json(topics);
  } catch (err) {
    console.error('Error fetching topics:', err.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// TOPIC CREATE
route.post('/api/topic', authenticate, authorize('topic', null, 'create'), async (c) => {
  try {
    const pool = getPool();
    const { title, content, parentid } = await c.req.json();
    console.log('title:', title);
    console.log('content:', content);
    console.log('parentid:', parentid);
    const user = c.get('user');
    console.log('user:', user);

    // Validate inputs
    if (!title) throw new Error('Topic title is required');
    if (!content) throw new Error('Topic content is required');
    if (!parentid) throw new Error('Board ID (parentid) is required');

    // Validate board_id exists
    const boardResult = await pool.query('SELECT id FROM boards WHERE id = $1', [parentid]);
    if (!boardResult.rows.length) {
      throw new Error(`Board with ID ${parentid} does not exist`);
    }

    const result = await pool.query(
      `INSERT INTO topics (board_id, user_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [parentid, user.id, title, content]
    );

    return c.json({ api: 'CREATE', topic: result.rows[0] }, 201);
  } catch (err) {
    console.error('TOPIC CREATE ERROR:', err.message);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// TOPIC UPDATE
route.put('/api/topic/:id', authenticate, authorize('topic', null, 'update'), async (c) => {
  const { id } = c.req.param();
  try {
    const pool = getPool();
    const { title, content } = await c.req.json();
    console.log('ID: ', id);
    console.log('title: ', title);
    console.log('content: ', content);
    const user = c.get('user');

    const result = await pool.query(
      `UPDATE topics SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [title, content, id]
    );

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Topic not found' }, 404);
    }

    return c.json({ api: 'UPDATE', topic: result.rows[0] });
  } catch (err) {
    console.error('Error updating topic:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// TOPIC DELETE
route.delete('/api/topic/:id', authenticate, authorize('topic', null, 'delete'), async (c) => {
  try {
    const pool = getPool();
    const { id } = c.req.param();
    const topicId = parseInt(id, 10);

    const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING id', [topicId]);

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Topic not found' }, 404);
    }

    console.log('DELETE...');
    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting topic:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

export default route;