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

// BOARD GET (by forum_id)
route.get('/api/boards/:id', authenticate, authorize('board', null, 'read'), async (c) => {
  try {
    const pool = getPool();
    const id = c.req.param('id');
    console.log('BOARDS: ', id);
    const result = await pool.query('SELECT * FROM boards WHERE forum_id = $1', [id]);
    const boards = result.rows;
    console.log('BOARDS:', boards);
    return c.json(boards);
  } catch (err) {
    console.error('Error fetching boards:', err.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// BOARD GET (by board id)
route.get('/api/board/:id', authenticate, authorize('board', null, 'read'), async (c) => {
  try {
    const { id } = c.req.param();
    const pool = getPool();
    const result = await pool.query('SELECT * FROM boards WHERE id = $1', [id]);
    const board = result.rows[0];
    if (!board) {
      return c.json({ api: 'ERROR', error: 'Board not found' }, 404);
    }
    return c.json(board);
  } catch (err) {
    console.error('Error fetching board:', err.stack);
    return c.json({ api: 'ERROR' }, 500);
  }
});

// BOARD CREATE
route.post('/api/board', authenticate, authorize('board', null, 'create'), async (c) => {
  try {
    const pool = getPool();
    const { name, description, moderator_group_id, parentid } = await c.req.json();
    // console.log('name:', name);
    // console.log('description:', description);
    // console.log('moderator_group_id:', moderator_group_id);
    // console.log('parentid:', parentid);
    const user = c.get('user');
    // console.log('user:', user);

    // Validate inputs
    if (!name) throw new Error('Board name is required');
    if (!parentid) throw new Error('Forum ID (parentid) is required');

    // Validate forum_id exists
    const forumResult = await pool.query('SELECT id FROM forums WHERE id = $1', [parentid]);
    if (!forumResult.rows.length) {
      throw new Error(`Forum with ID ${parentid} does not exist`);
    }

    // Validate moderator_group_id if provided
    if (moderator_group_id) {
      const groupResult = await pool.query('SELECT id FROM groups WHERE id = $1', [moderator_group_id]);
      if (!groupResult.rows.length) {
        throw new Error(`Group with ID ${moderator_group_id} does not exist`);
      }
    }

    const result = await pool.query(
      `INSERT INTO boards (forum_id, name, description, creator_id, moderator_group_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [parentid, name, description, user.id, moderator_group_id || null]
    );

    return c.json({ api: 'CREATE', board: result.rows[0] }, 201);
  } catch (err) {
    console.error('BOARD CREATE ERROR:', err.message);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// BOARD UPDATE
route.put('/api/board/:id', authenticate, authorize('board', null, 'update'), async (c) => {
  const { id } = c.req.param();
  try {
    const pool = getPool();
    const { name, description } = await c.req.json();
    console.log('ID: ', id);
    console.log('name: ', name);
    console.log('description: ', description);
    const user = c.get('user');

    const result = await pool.query(
      `UPDATE boards SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Board not found' }, 404);
    }

    return c.json({ api: 'UPDATE', board: result.rows[0] });
  } catch (err) {
    console.error('Error updating board:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// BOARD DELETE
route.delete('/api/board/:id', authenticate, authorize('board', null, 'delete'), async (c) => {
  try {
    const pool = getPool();
    const { id } = c.req.param();
    const boardId = parseInt(id, 10);

    const result = await pool.query('DELETE FROM boards WHERE id = $1 RETURNING id', [boardId]);

    if (!result.rows.length) {
      return c.json({ api: 'ERROR', error: 'Board not found' }, 404);
    }

    console.log('DELETE...');
    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting board:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

export default route;