const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const pool = require('../db');

const groups = new Hono();

groups.post('/', authenticate, authorize('group', null, 'create'), async (c) => {
  const { name, description } = await c.req.json();
  const result = await pool.query(
    'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return c.json(result.rows[0], 201);
});

groups.post('/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { userId, groupId } = await c.req.json();
  const result = await pool.query(
    'INSERT INTO group_memberships (user_id, group_id) VALUES ($1, $2) RETURNING *',
    [userId, groupId]
  );
  return c.json(result.rows[0], 201);
});

module.exports = groups;