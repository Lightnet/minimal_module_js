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
import { hashPassword } from '../../helpers.js';

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

async function setupAdminAndPermissions() {
  const pool = getPool();

  try {
    // Create admin user
    const adminUsername = 'admin';
    const adminEmail = 'admin';
    const adminPassword = 'admin'; // Change this!
    const { salt, hash } = await hashPassword(adminPassword); // Assumes hashPassword exists

    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, salt, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (username) DO NOTHING
       RETURNING id`,
      [adminUsername, adminEmail, hash, 'admin', salt]
    );

    let adminUserId;
    if (userResult.rows.length) {
      adminUserId = userResult.rows[0].id;
      console.log(`Created admin user: ${adminUsername} (ID: ${adminUserId})`);
    } else {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [adminUsername]
      );
      adminUserId = existingUser.rows[0].id;
      console.log(`Admin user already exists: ${adminUsername} (ID: ${adminUserId})`);
    }

    // Create groups
    const groups = [
      ['board1_moderators', 'Moderators for Board 1'],
      ['trusted_users', 'Users with extra privileges'],
    ];

    for (const [name, description] of groups) {
      await pool.query(
        `INSERT INTO groups (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [name, description]
      );
      console.log(`Inserted group: ${name}`);
    }

    // Assign admin to board1_moderators (group ID 1)
    await pool.query(
      `INSERT INTO group_memberships (user_id, group_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, group_id) DO NOTHING`,
      [adminUserId, 1]
    );
    console.log(`Assigned admin (ID: ${adminUserId}) to board1_moderators`);

    // Set up permissions
    const rolePermissions = [
      ['role', 'user', 'forum', null, 'read', true],
      ['role', 'user', 'board', null, 'read', true],
      ['role', 'user', 'topic', null, 'create', true],
      ['role', 'user', 'topic', null, 'read', true],
      ['role', 'user', 'comment', null, 'create', true],
      ['role', 'user', 'comment', null, 'read', true],
      ['role', 'moderator', 'forum', null, 'create', true],
      ['role', 'moderator', 'topic', null, 'update', true],
      ['role', 'moderator', 'topic', null, 'delete', true],
      ['role', 'moderator', 'comment', null, 'update', true],
      ['role', 'moderator', 'comment', null, 'delete', true],
      ['role', 'admin', 'forum', null, 'create', true],
      ['role', 'admin', 'forum', null, 'update', true],
      ['role', 'admin', 'forum', null, 'delete', true],
      ['role', 'admin', 'board', null, 'create', true],
      ['role', 'admin', 'board', null, 'update', true],
      ['role', 'admin', 'board', null, 'delete', true],
      ['role', 'admin', 'user', null, 'manage', true],
      ['role', 'admin', 'group', null, 'manage', true],
      ['role', 'admin', 'permissions', null, 'manage', true],
      ['role', 'admin', 'group_memberships', null, 'manage', true],
      ['role', 'admin', 'audit_logs', null, 'manage', true],
    ];

    const groupPermissions = [
      ['group', '1', 'topic', 1, 'update', true],
      ['group', '1', 'topic', 1, 'delete', true],
      ['group', '1', 'comment', 1, 'update', true],
      ['group', '1', 'comment', 1, 'delete', true],
      ['group', '2', 'topic', null, 'create', true],
    ];

    for (const [entity_type, entity_id, resource_type, resource_id, action, allowed] of rolePermissions) {
      await pool.query(
        `INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (entity_type, entity_id, resource_type, action) DO NOTHING`,
        [entity_type, entity_id, resource_type, resource_id, action, allowed]
      );
      console.log(`Inserted permission: ${entity_type}/${entity_id} -> ${resource_type}/${action}`);
    }

    for (const [entity_type, entity_id, resource_type, resource_id, action, allowed] of groupPermissions) {
      await pool.query(
        `INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (entity_type, entity_id, resource_type, action) DO NOTHING`,
        [entity_type, entity_id, resource_type, resource_id, action, allowed]
      );
      console.log(`Inserted permission: ${entity_type}/${entity_id} -> ${resource_type}/${action}`);
    }

    console.log('SETUP COMPLETED!');
  } catch (err) {
    console.error('Setup failed:', err.stack);
    throw err;
  }
}

// Run the setup
// setupAdminAndPermissions().catch((err) => {
//   console.error('Setup failed:', err.stack);
//   process.exit(1);
// });

async function setupPermissions() {
  const pool = getPool();

  const rolePermissions = [
    // User role
    ['role', 'user', 'forum', null, 'read', true],
    ['role', 'user', 'board', null, 'read', true],
    ['role', 'user', 'topic', null, 'create', true],
    ['role', 'user', 'topic', null, 'read', true],
    ['role', 'user', 'comment', null, 'create', true],
    ['role', 'user', 'comment', null, 'read', true],
    // Moderator role
    ['role', 'moderator', 'forum', null, 'create', true],
    ['role', 'moderator', 'topic', null, 'update', true],
    ['role', 'moderator', 'topic', null, 'delete', true],
    ['role', 'moderator', 'comment', null, 'update', true],
    ['role', 'moderator', 'comment', null, 'delete', true],
    // Admin role
    ['role', 'admin', 'forum', null, 'create', true],
    ['role', 'admin', 'forum', null, 'update', true],
    ['role', 'admin', 'forum', null, 'delete', true],
    ['role', 'admin', 'board', null, 'create', true],
    ['role', 'admin', 'board', null, 'update', true],
    ['role', 'admin', 'board', null, 'delete', true],
    ['role', 'admin', 'board', null, 'read', true],

    ['role', 'admin', 'topic', null, 'create', true],
    ['role', 'admin', 'topic', null, 'update', true],
    ['role', 'admin', 'topic', null, 'delete', true],
    ['role', 'admin', 'topic', null, 'read', true],

    ['role', 'admin', 'comment', null, 'create', true],
    ['role', 'admin', 'comment', null, 'update', true],
    ['role', 'admin', 'comment', null, 'delete', true],
    ['role', 'admin', 'comment', null, 'read', true],


    ['role', 'admin', 'user', null, 'manage', true],
    ['role', 'admin', 'group', null, 'manage', true],
    ['role', 'admin', 'permissions', null, 'manage', true],
    ['role', 'admin', 'group_memberships', null, 'manage', true],
    ['role', 'admin', 'audit_logs', null, 'manage', true],
  ];

  const groupPermissions = [
    // board1_moderators group
    ['group', '1', 'topic', 1, 'update', true],
    ['group', '1', 'topic', 1, 'delete', true],
    ['group', '1', 'comment', 1, 'update', true],
    ['group', '1', 'comment', 1, 'delete', true],
    ['group', '1', 'board', null, 'read', true], // Added for board1_moderators
    // trusted_users group
    ['group', '2', 'topic', null, 'create', true],
  ];

  const groups = [
    ['board1_moderators', 'Moderators for Board 1'],
    ['trusted_users', 'Users with extra privileges'],
  ];

  try {
    // Insert groups
    for (const [name, description] of groups) {
      await pool.query(
        `INSERT INTO groups (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [name, description]
      );
      console.log(`Inserted group: ${name}`);
    }

    // Insert role permissions
    for (const [entity_type, entity_id, resource_type, resource_id, action, allowed] of rolePermissions) {
      await pool.query(
        `INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (entity_type, entity_id, resource_type, action) DO NOTHING`,
        [entity_type, entity_id, resource_type, resource_id, action, allowed]
      );
      console.log(`Inserted permission: ${entity_type}/${entity_id} -> ${resource_type}/${action}`);
    }

    // Insert group permissions
    for (const [entity_type, entity_id, resource_type, resource_id, action, allowed] of groupPermissions) {
      await pool.query(
        `INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (entity_type, entity_id, resource_type, action) DO NOTHING`,
        [entity_type, entity_id, resource_type, resource_id, action, allowed]
      );
      console.log(`Inserted permission: ${entity_type}/${entity_id} -> ${resource_type}/${action}`);
    }

    console.log('CREATE PERMISSIONS!');
  } catch (err) {
    console.error('Error setting up permissions:', err.stack);
    throw err;
  }
}

// Run the setup
// setupPermissions().catch((err) => {
//   console.error('Setup failed:', err.stack);
//   process.exit(1);
// });