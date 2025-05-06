/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg/pg_auth.js';
import { addPermission } from '../../models/pg/pg_user.js';
import { logAudit } from './utils/pg_audit.js';

const permissions = new Hono();

// List all permissions (admin-only)
permissions.get('/permissions', authenticate, authorize('group', null, 'manage'), async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT id, entity_type, entity_id, resource_type, resource_id, action, allowed
      FROM permissions
    `);
    const permissionsList = result.rows;
    console.log(permissionsList);
    return c.json(permissionsList);
  } catch (err) {
    console.error('Error fetching permissions:', err.stack);
    return c.json({ error: 'Failed to fetch permissions' }, 500);
  }
});

// Add or update a permission
permissions.post('/permissions', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { entity_type, entity_id, resource_type, resource_id, action, allowed } = await c.req.json();

  try {
    const permission = await addPermission({
      entity_type,
      entity_id,
      resource_type,
      resource_id: resource_id ? parseInt(resource_id, 10) : null,
      action,
      allowed: allowed === true || allowed === 'true',
    });

    await logAudit(user.id, 'add_permission', {
      entity_type,
      entity_id,
      resource_type,
      resource_id,
      action,
      allowed,
    });

    return c.json(permission, 201);
  } catch (err) {
    console.error('Error adding permission:', err.stack);
    return c.json({ error: err.message }, 400);
  }
});

// Delete a permission
permissions.delete('/permissions/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { id } = c.req.param();
  try {
    const pool = getPool();
    console.log('delete id:', id);
    const permissionId = parseInt(id, 10);
    const result = await pool.query('DELETE FROM permissions WHERE id = $1 RETURNING id', [permissionId]);

    if (!result.rows.length) {
      return c.json({ error: 'Permission not found' }, 404);
    }

    console.log('DELETE...');
    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting permission:', err.stack);
    return c.json({ error: 'ERROR PERMISSION DELETE FAILED!' }, 400);
  }
});

export default permissions;