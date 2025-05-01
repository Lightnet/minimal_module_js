// const db = require('../db');
// const bcrypt = require('bcrypt');
import db from '../../db/sqlite/sqlite_db.js';
// import bcrypt from 'bcrypt';
import { compareHashPassword, hashPassword } from '../../helpers.js';


async function signup(username, email, password, role = 'user') {
  // const saltRounds = 10;
  // const passwordHash = await bcrypt.hash(password, saltRounds);

  let {salt, hash} = hashPassword(password);
  let passwordHash = hash;
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash, role, salt)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(username, email, passwordHash, role, salt);
  return { id: result.lastInsertRowid, username, email, role };
}

async function login(email, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  if (!user) throw new Error('User not found');
  // const isValid = await bcrypt.compare(password, user.password_hash);
  const isValid = compareHashPassword(password, user.password_hash,user.salt);
  // if (!isValid) throw new Error('Invalid password');
  console.log("isValid: ",isValid);
  if (!isValid){
    return false;
  };
  return user;
}

function getUserGroups(userId) {
  const stmt = db.prepare('SELECT group_id FROM group_memberships WHERE user_id = ?');
  return stmt.all(userId).map((row) => row.group_id);
}

function checkPermission(user, resourceType, resourceId, action) {
  const groupIds = getUserGroups(user.id);
  const entities = [
    { type: 'role', id: user.role },
    ...groupIds.map((id) => ({ type: 'group', id: id.toString() })),
  ];

  const query = `
    SELECT allowed
    FROM permissions
    WHERE entity_type = ? AND entity_id = ?
      AND resource_type = ?
      AND (resource_id = ? OR resource_id IS NULL)
      AND action = ?
    LIMIT 1
  `;
  const stmt = db.prepare(query);

  for (const entity of entities) {
    const result = stmt.get(
      entity.type,
      entity.id,
      resourceType,
      resourceId ?? null,
      action
    );
    if (result && result.allowed) {
      return true;
    }
  }
  return false;
}

// New function to check if a user exists
function checkUserExists({ email, username }) {
  if (!email && !username) {
    throw new Error('At least one of email or username must be provided');
  }

  let query = 'SELECT id FROM users WHERE ';
  const params = [];
  const conditions = [];

  if (email) {
    conditions.push('email = ?');
    params.push(email);
  }
  if (username) {
    conditions.push('username = ?');
    params.push(username);
  }

  query += conditions.join(' OR ');

  const stmt = db.prepare(query);
  const user = stmt.get(...params);
  return !!user; // Returns true if user exists, false otherwise
}

function createForum(name, description, creatorId, moderatorGroupId) {
  const stmt = db.prepare(`
    INSERT INTO forums (name, description, creator_id, moderator_group_id)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(name, description, creatorId, moderatorGroupId);
  return db.prepare('SELECT * FROM forums WHERE id = ?').get(result.lastInsertRowid);
}

function getForumById(forumId) {
  const stmt = db.prepare('SELECT * FROM forums WHERE id = ?');
  return stmt.get(forumId);
}

// module.exports = { signup, login, getUserGroups, checkPermission };
export { 
  signup, 
  login, 
  getUserGroups, 
  checkPermission, 
  checkUserExists,
  createForum,
  getForumById
};