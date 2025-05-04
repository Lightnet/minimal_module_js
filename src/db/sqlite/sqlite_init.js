// const Database = require('better-sqlite3');
// const fs = require('fs');
// const path = require('path');
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

async function initializeDatabase(dbPathArg) {
  // console.log("dbPathArg: ",dbPathArg);
  const db = new Database(dbPathArg);
  // const Database = await import('better-sqlite3'); // Dynamic import
  // const db = new Database.default(dbPathArg, { verbose: console.log }); // Use .default for CommonJS
  
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(path.join(__dirname, 'sqlite_schema.sql'), 'utf8');
  db.exec(schema);

  // const insertUser = db.prepare(`
  //   INSERT OR IGNORE INTO users (username, email, password_hash, role) 
  //   VALUES (?, ?, ?, ?)
  // `);
  // insertUser.run('admin', 'admin@example.com', 'hashed_password', 'admin');
  // insertUser.run('moderator', 'mod@example.com', 'hashed_password', 'moderator');
  // insertUser.run('user', 'user@example.com', 'hashed_password', 'user');

  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const rolePermissions = [
    // User role
    ['role', 'user', 'forum', null, 'read', 1],
    ['role', 'user', 'board', null, 'read', 1],
    ['role', 'user', 'topic', null, 'create', 1],
    ['role', 'user', 'topic', null, 'read', 1],
    ['role', 'user', 'comment', null, 'create', 1],
    ['role', 'user', 'comment', null, 'read', 1],
    // Moderator role
    ['role', 'moderator', 'forum', null, 'create', 1],
    ['role', 'moderator', 'topic', null, 'update', 1],
    ['role', 'moderator', 'topic', null, 'delete', 1],
    ['role', 'moderator', 'comment', null, 'update', 1],
    ['role', 'moderator', 'comment', null, 'delete', 1],
    // Admin role
    ['role', 'admin', 'forum', null, 'create', 1],
    ['role', 'admin', 'forum', null, 'update', 1],
    ['role', 'admin', 'forum', null, 'delete', 1],
    ['role', 'admin', 'board', null, 'create', 1],
    ['role', 'admin', 'board', null, 'update', 1],
    ['role', 'admin', 'board', null, 'delete', 1],
    ['role', 'admin', 'user', null, 'manage', 1], // Account creation and management
    ['role', 'admin', 'group', null, 'manage', 1], // Group management
    ['role', 'admin', 'permissions', null, 'manage', 1], // Permission management
    ['role', 'admin', 'group_memberships', null, 'manage', 1], // Group membership management
    ['role', 'admin', 'audit_logs', null, 'manage', 1],
  ];

  const groupPermissions = [
    // Example: board1_moderators group for a specific forum
    ['group', '1', 'topic', 1, 'update', 1],
    ['group', '1', 'topic', 1, 'delete', 1],
    ['group', '1', 'comment', 1, 'update', 1],
    ['group', '1', 'comment', 1, 'delete', 1],
    // Example: trusted_users group
    ['group', '2', 'topic', null, 'create', 1],
  ];

  rolePermissions.forEach((perm) => insertPermission.run(...perm));
  groupPermissions.forEach((perm) => insertPermission.run(...perm));

  const insertGroup = db.prepare(`
    INSERT OR IGNORE INTO groups (name, description) VALUES (?, ?)
  `);
  insertGroup.run('board1_moderators', 'Moderators for Board 1');
  insertGroup.run('trusted_users', 'Users with extra privileges');
  console.log("CREATE PERMISSIONS!")

  return db;
}

// module.exports = initializeDatabase;
export{
  initializeDatabase
};
export default initializeDatabase;