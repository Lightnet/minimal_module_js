const { Hono } = require('hono');
const { authenticate, authorize } = require('../middleware/auth');
const { addPermission } = require('../models');

const permissions = new Hono();

permissions.post('/', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { entity_type, entity_id, resource_type, resource_id, action, allowed } = await c.req.json();

  try {
    const permission = addPermission({
      entity_type,
      entity_id,
      resource_type,
      resource_id,
      action,
      allowed,
    });
    return c.json(permission, 201);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

module.exports = permissions;