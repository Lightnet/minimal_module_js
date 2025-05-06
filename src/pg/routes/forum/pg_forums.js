/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from '../../../routes/pages.js';
import { getPool } from '../../db/pg_pool.js';
import { getForumById, createForum } from '../../models/pg_user.js'; // Update to pg_user.js
import { authenticate, authorize } from '../../middleware/pg_auth.js'; // Update to pg_auth.js

const route = new Hono();

route.get('/forum', (c) => {
  const pageHtml = scriptHtml02('/index.js');
  return c.html(pageHtml);
});

route.get('/forum/*', (c) => {
  const pageHtml = scriptHtml02('/index.js');
  return c.html(pageHtml);
});

route.get('/board/*', (c) => {
  const pageHtml = scriptHtml02('/index.js');
  return c.html(pageHtml);
});

route.get('/topic/*', (c) => {
  const pageHtml = scriptHtml02('/index.js');
  return c.html(pageHtml);
});

route.get('/comment/*', (c) => {
  const pageHtml = scriptHtml02('/index.js');
  return c.html(pageHtml);
});

//===============================================
// FORUM
//===============================================
// FORUM GET
route.get('/api/forum', authenticate, async (c) => {
  const pool = getPool();
  try {
    const result = await pool.query('SELECT * FROM forums');
    const forums = result.rows;
    return c.json(forums);
  } catch (err) {
    console.error('Error fetching forums:', err.stack);
    return c.json({ error: 'Failed to fetch forums' }, 500);
  }
});

route.get('/api/forum/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  try {
    const forum = await getForumById(id);
    if (!forum) {
      return c.json({ error: 'Forum not found' }, 404);
    }
    return c.json(forum);
  } catch (err) {
    console.error('Error fetching forum:', err.stack);
    return c.json({ error: 'Failed to fetch forum' }, 500);
  }
});

// FORUM CREATE
route.post('/api/forum', authenticate, authorize('forum', null, 'create'), async (c) => {
  const { name, description, moderator_group_id } = await c.req.json();
  console.log('name:', name);
  console.log('description:', description);
  console.log('moderator_group_id:', moderator_group_id);
  const user = c.get('user');
  console.log('user:', user);
  try {
    const forum = await createForum(name, description, user.id, moderator_group_id);
    console.log('forum:', forum);
    return c.json({
      api: 'CREATE',
      id: forum.id,
      name,
      description,
    }, 201);
  } catch (err) {
    console.error('Error creating forum:', err.stack);
    return c.json({ error: err.message }, 400);
  }
});

// FORUM UPDATE
route.put('/api/forum/:id', authenticate, authorize('forum', null, 'update'), async (c) => {
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  try {
    const authResult = await authorize('forum', forumId, 'update')(c, c);
    if (authResult) return authResult;

    const { name, description, moderator_group_id } = await c.req.json();
    console.log('name:', name);
    console.log('description:', description);
    console.log('moderator_group_id:', moderator_group_id);

    const pool = getPool();
    const result = await pool.query(
      'UPDATE forums SET name = $1, description = $2, moderator_group_id = $3 WHERE id = $4 RETURNING *',
      [name, description, moderator_group_id, forumId]
    );

    if (!result.rows.length) {
      return c.json({ error: 'Forum not found' }, 404);
    }

    return c.json({ api: 'UPDATE', forum: result.rows[0] });
  } catch (err) {
    console.error('Error updating forum:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

// FORUM DELETE
route.delete('/api/forum/:id', authenticate, authorize('forum', null, 'delete'), async (c) => {
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  try {
    const authResult = await authorize('forum', forumId, 'delete')(c, c);
    if (authResult) return authResult;

    const pool = getPool();
    const result = await pool.query('DELETE FROM forums WHERE id = $1 RETURNING id', [forumId]);

    if (!result.rows.length) {
      return c.json({ error: 'Forum not found' }, 404);
    }

    console.log('DELETE...');
    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting forum:', err.stack);
    return c.json({ error: 'Delete failed' }, 400);
  }
});

//===============================================
// EXPORT
//===============================================
export default route;