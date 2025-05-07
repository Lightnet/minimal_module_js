/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { getDB } from '../db/sqlite_db.js';
import { compareHashPassword, hashPassword } from '../../helpers.js';

async function signup(username, email, password, role = 'user') {
  const db = await getDB();
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
  const db = await getDB();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  // console.log("[login] "+user);
  // console.log(user);
  // console.log(user.id);
  if (!user) throw new Error('User not found');
  // const isValid = await bcrypt.compare(password, user.password_hash);
  const isValid = compareHashPassword(password, user.password_hash,user.salt);
  // if (!isValid) throw new Error('Invalid password');
  // console.log("isValid: ",isValid);
  if (!isValid){
    return false;
  };
  return user;
}

async function getUserGroups(userId) {
  const db = await getDB();
  const stmt = db.prepare('SELECT group_id FROM group_memberships WHERE user_id = ?');
  return stmt.all(userId).map((row) => row.group_id);
}

async function checkPermission(user, resourceType, resourceId, action) {
  const db = await getDB();
  const groupIds = await getUserGroups(user.id);
  // console.log("groupIds:", groupIds);
  // console.log("role:", user.role);
  // user.role = "admin";
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
    // console.log("result: ", result);
    if (result && result.allowed) {
      return true;
    }
  }
  return false;
}

// New function to check if a user exists
async function checkUserExists({ email, username }) {
  const db = await getDB();
  // console.log(db);
  // console.log("[checkUserExists] username: ", username);
  // console.log("[checkUserExists] email: ", email);
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
  // console.log("user",user);
  // console.log("user",!!user);
  return !!user; // Returns true if user exists, false otherwise
}

async function createForum(name, description, creatorId, moderatorGroupId) {
  const db = await getDB();
  db.pragma('foreign_keys = 0');
  console.log("name: ", name);
  console.log("description: ", description);
  console.log("creatorId: ", creatorId);
  console.log("moderatorGroupId: ", moderatorGroupId);
  try {
    //need to fixed same name error forum...
    console.log("db:",db);
    const stmt = db.prepare(`INSERT INTO forums (name, description, creator_id, moderator_group_id)
      VALUES (?, ?, ?, ?)`);
    const result = stmt.run(name, description, creatorId, moderatorGroupId);
    console.log("result:", result);
    return db.prepare('SELECT * FROM forums WHERE id = ?').get(result.lastInsertRowid);  
  } catch (error) {
    console.log("ERROR FORUM QUERY...", error.message);
    return null;
  }
  
}

async function getForumById(forumId) {
  const db = await getDB();
  const stmt = db.prepare('SELECT * FROM forums WHERE id = ?');
  return stmt.get(forumId);
}

// New function for admin to create a user account
async function adminCreateUser({ username, email, password, role = 'user', groupIds = [] }) {
  const db = await getDB();
  if (!['user', 'moderator', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  // Check if user already exists
  // console.log("[adminCreateUser] username:",username)
  // console.log("[adminCreateUser] email:",email)
  let isExist = await checkUserExists({ email, username });
  // console.log("[adminCreateUser] isExist:",isExist);
  if (isExist) {
    throw new Error('User with this email or username already exists');
  }
  // console.log("REGISTER????")

  // Create user
  const user = await signup(username, email, password, role);

  // Assign to groups
  if (groupIds.length > 0) {
    const stmt = db.prepare(`
      INSERT INTO group_memberships (user_id, group_id)
      VALUES (?, ?)
    `);
    for (const groupId of groupIds) {
      // Validate group exists
      const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(groupId);
      if (!group) {
        throw new Error(`Group with ID ${groupId} does not exist`);
      }
      stmt.run(user.id, groupId);
    }
  }

  return { ...user, groupIds };
}

// New function to add permissions
async function addPermission({ entity_type, entity_id, resource_type, resource_id, action, allowed }) {
  const db = await getDB();
  if (!['role', 'group'].includes(entity_type)) {
    throw new Error('Invalid entity_type');
  }
  if (entity_type === 'group') {
    const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(entity_id);
    if (!group) {
      throw new Error(`Group with ID ${entity_id} does not exist`);
    }
  } else if (entity_type === 'role' && !['user', 'moderator', 'admin'].includes(entity_id)) {
    throw new Error('Invalid role');
  }
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(entity_type, entity_id, resource_type, resource_id || null, action, allowed ? 1 : 0);
  return { id: result.lastInsertRowid, entity_type, entity_id, resource_type, resource_id, action, allowed };
}

export { 
  signup, 
  login, 
  getUserGroups, 
  checkPermission, 
  checkUserExists,
  createForum,
  getForumById,
  adminCreateUser,
  addPermission
};