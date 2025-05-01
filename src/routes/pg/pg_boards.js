const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const pool = require('../db');

const boards = new Hono();

boards.get('/', async (c) => {
  const result = await pool.query('SELECT * FROM boards');
  return c.json(result.rows);
});

boards.post('/', authenticate, authorize('board', null, 'create'), async (c) => {
  const { name, description, moderator_group_id } = await c.req.json();
  const result = await pool.query(
    'INSERT INTO boards (name, description, moderator_group_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, moderator_group_id]
  );
  return c.json(result.rows[0], 201);
});

boards.put('/:id', authenticate, authorize('board', c.req.param('id'), 'update'), async (c) => {
  const { id } = c.req.param();
  const { name, description, moderator_group_id } = await c.req.json();
  const result = await pool.query(
    'UPDATE boards SET name = $1, description = $2, moderator_group_id = $3 WHERE id = $4 RETURNING *',
    [name, description, moderator_group_id, id]
  );
  return c.json(result.rows[0]);
});

boards.delete('/:id', authenticate, authorize('board', c.req.param('id'), 'delete'), async (c) => {
  const { id } = c.req.param();
  await pool.query('DELETE FROM boards WHERE id = $1', [id]);
  return c.json({ message: 'Board deleted' });
});

module.exports = boards;