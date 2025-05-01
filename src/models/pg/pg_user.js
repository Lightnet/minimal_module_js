import { pool } from "../../db/pg/pg_pool.js";
//const bcrypt = require('bcrypt');
import bcrypt from 'bcypt';

export async function signup(username, email, password, role = 'user') {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
    [username, email, passwordHash, role]
  );
  return result.rows[0];
}

export async function login(email, password) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) throw new Error('User not found');
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error('Invalid password');
  return user;
}

export async function getUserGroups(userId) {
  const result = await pool.query(
    'SELECT group_id FROM group_memberships WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((row) => row.group_id);
}

export async function checkPermission(user, resourceType, resourceId, action) {
  const groupIds = await getUserGroups(user.id);
  const entities = [
    { type: 'role', id: user.role },
    ...groupIds.map((id) => ({ type: 'group', id: id.toString() })),
  ];

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
    if (result.rows.length > 0 && result.rows[0].allowed) {
      return true;
    }
  }
  return false;
}