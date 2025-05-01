const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const pool = require('../db');

const comments = new Hono();

comments.get('/:topicId', async ([attr]) => {
  const { topicId } = c.req.param();
  const result = await pool.query('SELECT * FROM comments WHERE topic_id = $1 AND status = $2', [
    topicId,
    'active',
  ]);
  return c.json(result.rows);
});

comments.post('/', authenticate, authorize('comment', null, 'create'), async (c) => {
  const { topicId, content } = await c.req.json();
  const user = c.get('user');
  const result = await pool.query(
    'INSERT INTO comments (topic_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
    [topicId, user.id, content]
  );
  return c.json(result.rows[0], 201);
});

comments.delete('/:id', authenticate, authorize('comment', c.req.param('id'), 'delete'), async (c) => {
  const { id } = c.req.param();
  await pool.query('UPDATE comments SET status = $1 WHERE id = $2', ['deleted', id]);
  return c.json({ message: 'Comment deleted' });
});

module.exports = comments;