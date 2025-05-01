const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const { createForum, getForumById } = require('../models');
const db = require('../db');

const forums = new Hono();

forums.get('/', async (c) => {
  const stmt = db.prepare('SELECT * FROM forums');
  const forums = stmt.all();
  return c.json(forums);
});

forums.get('/:id', async (c) => {
  const { id } = c.req.param();
  const forum = getForumById(id);
  if (!forum) {
    return c.json({ error: 'Forum not found' }, 404);
  }
  return c.json(forum);
});

forums.post('/', authenticate, authorize('forum', null, 'create'), async (c) => {
  const { name, description, moderator_group_id } = await c.req.json();
  const user = c.get('user');
  try {
    const forum = createForum(name, description, user.id, moderator_group_id);
    return c.json(forum, 201);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

forums.put('/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  const authResult = await authorize('forum', forumId, 'update')(c.req, c);
  if (authResult) return authResult;

  const { name, description, moderator_group_id } = await c.req.json();
  const stmt = db.prepare(`
    UPDATE forums
    SET name = ?, description = ?, moderator_group_id = ?
    WHERE id = ?
  `);
  stmt.run(name, description, moderator_group_id, id);
  const updatedForum = getForumById(id);
  return c.json(updatedForum);
});

forums.delete('/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  const authResult = await authorize('forum', forumId, 'delete')(c.req, c);
  if (authResult) return authResult;

  const stmt = db.prepare('DELETE FROM forums WHERE id = ?');
  stmt.run(id);
  return c.json({ message: 'Forum deleted' });
});

module.exports = forums;