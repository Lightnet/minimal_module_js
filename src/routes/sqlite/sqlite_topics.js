const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../db');

const topics = new Hono();

topics.get('/:boardId', async (c) => {
  const { boardId } = c.req.param();
  const stmt = db.prepare('SELECT * FROM topics WHERE board_id = ? AND status = ?');
  const topics = stmt.all(boardId, 'active');
  return c.json(topics);
});

topics.post('/', authenticate, authorize('topic', null, 'create'), async (c) => {
  const { boardId, title, content } = await c.req.json();
  const user = c.get('user');
  const stmt = db.prepare(`
    INSERT INTO topics (board_id, user_id, title, content)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(boardId, user.id, title, content);
  const newTopic = db.prepare('SELECT * FROM topics WHERE id = ?').get(result.lastInsertRowid);
  return c.json(newTopic, 201);
});

topics.put('/:id', authenticate, async (c) => {
  const { id } = c.req.param();
  const topicId = parseInt(id, 10);
  const authResult = await authorize('topic', topicId, 'update')(c.req, c);
  if (authResult) return authResult;
  
  const { title, content } = await c.req.json();
  const stmt = db.prepare(`
    UPDATE topics
    SET title = ?, content = ?
    WHERE id = ?
  `);
  stmt.run(title, content, id);
  const updatedTopic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
  return c.json(updatedTopic);
});

module.exports = topics;