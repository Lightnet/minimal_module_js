/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { getPool } from '../db/pg_pool.js';
import { compareHashPassword, hashPassword } from '../../helpers.js';

export async function signup(username, email, password, role = 'user') {
  const pool = getPool();
  let { salt, hash } = hashPassword(password);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, salt, role',
      [username, email, hash, salt, role]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error signing up user:', err.stack);
    throw err;
  }
}

export async function login(email, password) {
  const pool = getPool();
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) throw new Error('User not found');
    const isValid = await compareHashPassword(password, user.password_hash, user.salt);
    if (!isValid) throw new Error('Invalid password');
    return user;
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    throw err;
  }
}

export async function checkUserExists({ email, username }) {
  if (!email && !username) {
    throw new Error('At least one of email or username must be provided');
  }

  let query = 'SELECT id FROM users WHERE ';
  const params = [];
  const conditions = [];

  if (email) {
    conditions.push(`email = $${params.length + 1}`);
    params.push(email);
  }
  if (username) {
    conditions.push(`username = $${params.length + 1}`);
    params.push(username);
  }

  query += conditions.join(' OR ');

  try {
    const pool = getPool();
    const result = await pool.query(query, params);
    return !!result.rows.length; // Returns true if user exists, false otherwise
  } catch (err) {
    console.error('Error checking user existence:', err.stack);
    throw err;
  }
}

export async function adminCreateUser({ username, email, password, role = 'user', groupIds = [] }) {
  if (!['user', 'moderator', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  const pool = getPool();
  let client;

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query('BEGIN');

    // Check if user already exists
    const exists = await checkUserExists({ email, username });
    if (exists) {
      throw new Error('User with this email or username already exists');
    }

    // Create user
    const user = await signup(username, email, password, role);

    // Assign to groups
    if (groupIds.length > 0) {
      for (const groupId of groupIds) {
        // Validate group exists
        const groupResult = await client.query('SELECT id FROM groups WHERE id = $1', [groupId]);
        if (!groupResult.rows.length) {
          throw new Error(`Group with ID ${groupId} does not exist`);
        }

        // Insert group membership
        await client.query(
          'INSERT INTO group_memberships (user_id, group_id) VALUES ($1, $2)',
          [user.id, groupId]
        );
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    return { ...user, groupIds };
  } catch (err) {
    // Roll back transaction on error
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error creating user:', err.stack);
    throw err;
  } finally {
    // Release client back to pool
    if (client) {
      client.release();
    }
  }
}

export async function getUserGroups(userId) {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT group_id FROM group_memberships WHERE user_id = $1',
      [userId]
    );
    return result.rows.map((row) => row.group_id);
  } catch (err) {
    console.error('Error getting user groups:', err.stack);
    throw err;
  }
}

export async function checkPermission(user, resourceType, resourceId, action) {
  const pool = getPool();
  try {
    const groupIds = await getUserGroups(user.id);
    console.log("groupIds:", groupIds);
    const entities = [
      { type: 'role', id: user.role },
      ...groupIds.map((id) => ({ type: 'group', id: id.toString() })),
    ];
    console.log("entities: ", entities);

    // Build query to check permissions
    const query = `
      SELECT allowed
      FROM permissions
      WHERE (entity_type = $1 AND entity_id = $2)
        AND resource_type = $3
        AND (resource_id = $4 OR resource_id IS NULL)
        AND action = $5
      LIMIT 1
    `;

    for (const entity of entities) {
      const result = await pool.query(query, [
        entity.type,
        entity.id,
        resourceType,
        resourceId,
        action,
      ]);
      console.log("result:", result);

      if (result.rows.length > 0 && result.rows[0].allowed) {
        console.log("result.rows[0].allowed: ",result.rows[0].allowed)
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error checking permission:', err.stack);
    throw err;
  }
}

export async function addPermission({ entity_type, entity_id, resource_type, resource_id, action, allowed }) {
  const pool = getPool();
  try {
    // Validate group existence if entity_type is 'group'
    if (entity_type === 'group') {
      const groupResult = await pool.query(`SELECT id FROM groups WHERE id = $1`, [entity_id]);
      if (!groupResult.rows.length) {
        throw new Error(`Group with ID ${entity_id} does not exist`);
      }
    } else if (entity_type === 'role' && !['user', 'moderator', 'admin'].includes(entity_id)) {
      throw new Error('Invalid role');
    }

    // Insert or update the permission
    const query = `
      INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (entity_type, entity_id, resource_type, action)
      DO UPDATE SET resource_id = EXCLUDED.resource_id, allowed = EXCLUDED.allowed
      RETURNING id
    `;
    const params = [
      entity_type,
      entity_id,
      resource_type,
      resource_id || null,
      action,
      allowed,
    ];

    const result = await pool.query(query, params);
    const id = result.rows[0].id;

    return { id, entity_type, entity_id, resource_type, resource_id, action, allowed };
  } catch (err) {
    console.error('Error adding permission:', err.stack);
    throw err;
  }
}

export async function getForumById(id) {
  const pool = getPool();
  try {
    const result = await pool.query('SELECT * FROM forums WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error fetching forum by ID:', err.stack);
    throw err;
  }
}

export async function createForum(name, description, creator_id, moderator_group_id) {
  const pool = getPool();
  try {
    // Validate inputs
    if (!name) {
      throw new Error('Forum name is required');
    }
    if (!creator_id) {
      throw new Error('Creator ID is required');
    }

    // Validate moderator_group_id if provided
    if (moderator_group_id) {
      const groupResult = await pool.query('SELECT id FROM groups WHERE id = $1', [moderator_group_id]);
      if (!groupResult.rows.length) {
        throw new Error(`Group with ID ${moderator_group_id} does not exist`);
      }
    }

    const result = await pool.query(
      'INSERT INTO forums (name, description, creator_id, moderator_group_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, creator_id, moderator_group_id || null]
    );

    return result.rows[0];
  } catch (err) {
    console.error('Error creating forum:', err.stack);
    throw err;
  }
}






