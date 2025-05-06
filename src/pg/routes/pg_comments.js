/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../db/pg_pool.js';
import { authenticate, authorize } from '../middleware/pg_auth.js'; // Update to pg_auth.js

const route = new Hono();

//===============================================
// COMMENT
//===============================================

// GET COMMENTS (by topic_id)
route.get('/api/comments/:id', authenticate, authorize('comment', null, 'read'), async (c) => {
  try {
    const pool = getPool();
    const id = c.req.param('id');
    console.log('TOPICS: ', id);
    const result = await pool.query('SELECT * FROM comments WHERE topic_id = $1', [id]);
    const comments = result.rows;
    console.log('COMMENTS:', comments);
    return c.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// CREATE COMMENT
route.post('/api/comment', authenticate, authorize('comment', null, 'create'), async (c) => {
  try {
    const pool = getPool();
    const { content, parentid } = await c.req.json();
    console.log('content:', content);
    console.log('parentid:', parentid);
    const user = c.get('user');
    console.log('user:', user);

    // Validate inputs
    if (!content) throw new Error('Comment content is required');
    if (!parentid) throw new Error('Topic ID (parentid) is required');

    // Validate topic_id exists
    const topicResult = await pool.query('SELECT id FROM topics WHERE id = $1', [parentid]);
    if (!topicResult.rows.length) {
      throw new Error(`Topic with ID ${parentid} does not exist`);
    }

    const result = await pool.query(
      `INSERT INTO comments (topic_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parentid, user.id, content]
    );

    return c.json({ api: 'CREATE', comment: result.rows[0] }, 201);
  } catch (err) {
    console.error('COMMENT CREATE ERROR:', err.message);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// COMMENT UPDATE
route.put('/api/comment/:id', authenticate, authorize('comment', null, 'update'), async (c) => {
  const { id } = c.req.param();
  try {
    const pool = getPool();
    const { content } = await c.req.json();
    console.log('ID: ', id);
    console.log('Comment: ', content);
    const user = c.get('user');

    const result = await pool.query(
      `UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [content, id]
    );

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Comment not found' }, 404);
    }

    return c.json({ api: 'UPDATE', comment: result.rows[0] });
  } catch (err) {
    console.error('Error updating comment:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// COMMENT DELETE
route.delete('/api/comment/:id', authenticate, authorize('comment', null, 'delete'), async (c) => {
  try {
    const pool = getPool();
    const { id } = c.req.param();
    const commentId = parseInt(id, 10);

    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [commentId]);

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Comment not found' }, 404);
    }

    console.log('DELETE...');
    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting comment:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

export default route;