const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const pool = require('../db');

const topics = new Hono();

topics.get('/:boardId', async (c) => {
  const { boardId } = c.req.param();
  const result = await pool.query('SELECT * FROM topics WHERE board_id = $1 AND status = $2', [
    boardId,
    'active',
  ]);
  return c.json(result.rows);
});

topics.post('/', authenticate, authorize('topic', null, 'create'), async (c) => {
  const { boardId, title, content } = await c.req.json();
  const user = c.get('user');
  const result = await pool.query(
    'INSERT INTO topics (board_id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
    [boardId, user.id, title, content]
  );
  return c.json(result.rows[0], 201);
});

topics.put('/:id', authenticate, authorize('topic', c.req.param('id'), 'update'), async (c) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json();
  const result = await pool.query(
    'UPDATE topics SET title = $1, content = $2 WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return c.json(result.rows[0]);
});

module.exports = topics;