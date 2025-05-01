// const { Hono } = require('hono');
// const { authenticate, authorize } = require('../middleware/auth');
// const db = require('../db');
import { Hono } from 'hono';
import { authenticate, authorize } from '../../middleware/pg/pg_auth.js';


const boards = new Hono();

boards.get('/', async (c) => {
  const { forumId } = c.req.query();
  let stmt;
  if (forumId) {
    stmt = db.prepare('SELECT * FROM boards WHERE forum_id = ?');
    return c.json(stmt.all(forumId));
  }
  stmt = db.prepare('SELECT * FROM boards');
  return c.json(stmt.all());
});

boards.post('/', authenticate, authorize('board', null, 'create'), async (c) => {
  const { forum_id, name, description, moderator_group_id } = await c.req.json();
  const stmt = db.prepare(`
    INSERT INTO boards (forum_id, name, description, moderator_group_id)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(forum_id, name, description, moderator_group_id);
  const newBoard = db.prepare('SELECT * FROM boards WHERE id = ?').get(result.lastInsertRowid);
  return c.json(newBoard, 201);
});

boards.put('/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const boardId = parseInt(id, 10);
  const authResult = await authorize('board', boardId, 'update')(c.req, c);
  if (authResult) return authResult;

  const { forum_id, name, description, moderator_group_id } = await c.req.json();
  const stmt = db.prepare(`
    UPDATE boards
    SET forum_id = ?, name = ?, description = ?, moderator_group_id = ?
    WHERE id = ?
  `);
  stmt.run(forum_id, name, description, moderator_group_id, id);
  const updatedBoard = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
  return c.json(updatedBoard);
});

boards.delete('/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const boardId = parseInt(id, 10);
  const authResult = await authorize('board', boardId, 'delete')(c.req, c);
  if (authResult) return authResult;

  const stmt = db.prepare('DELETE FROM boards WHERE id = ?');
  stmt.run(id);
  return c.json({ message: 'Board deleted' });
});

// module.exports = boards;
export {
  boards
}