// const { Hono } = require('hono');
// const { authenticate, authorize } = require('../middleware/auth');
// const pool = require('../db');
import { Hono } from 'hono';
import { authenticate, authorize } from '../middleware/sqlite/sqlite_auth.js';
import db from '../db/sqlite/sqlite_db.js';
const groups = new Hono();

// Test
// groups.get('groups/test', async (c) => {
//   return c.json({test:"test"});
// });
// Get all groups
groups.get('groups', async (c) => {
  const stmt = db.prepare('SELECT id, name, description, created_at FROM groups');
  const groups = stmt.all();
  return c.json(groups);
});

// Create a new group
groups.post('groups/', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { name, description } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Group name is required' }, 400);
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO groups (name, description)
      VALUES (?, ?)
    `);
    const result = stmt.run(name, description || null);
    const newGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(result.lastInsertRowid);
    return c.json(newGroup, 201);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Group name already exists' }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Assign a user to a group
groups.post('groups/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { userId, groupId } = await c.req.json();

  // Validate inputs
  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }

  // Check if user exists
  const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!userExists) {
    return c.json({ error: 'User does not exist' }, 400);
  }

  // Check if group exists
  const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(groupId);
  if (!group) {
    return c.json({ error: 'Group does not exist' }, 400);
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO group_memberships (user_id, group_id)
      VALUES (?, ?)
    `);
    stmt.run(userId, groupId);
    return c.json({ userId, groupId, joined_at: new Date().toISOString() }, 201);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'User is already a member of this group' }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Remove a user from a group
groups.delete('groups/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { userId, groupId } = await c.req.json();

  // Validate inputs
  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }

  // Check if membership exists
  const membership = db.prepare(`
    SELECT user_id, group_id FROM group_memberships
    WHERE user_id = ? AND group_id = ?
  `).get(userId, groupId);
  if (!membership) {
    return c.json({ error: 'User is not a member of this group' }, 404);
  }

  const stmt = db.prepare(`
    DELETE FROM group_memberships
    WHERE user_id = ? AND group_id = ?
  `);
  stmt.run(userId, groupId);
  return c.json({ message: 'User removed from group' });
});

// Delete a group
groups.delete('groups/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { id } = c.req.param();

  // Check if group exists
  const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(id);
  if (!group) {
    return c.json({ error: 'Group not found' }, 404);
  }

  // Check for dependencies (e.g., forums or boards using this group as moderator_group_id)
  const forumCount = db.prepare('SELECT COUNT(*) as count FROM forums WHERE moderator_group_id = ?').get(id).count;
  const boardCount = db.prepare('SELECT COUNT(*) as count FROM boards WHERE moderator_group_id = ?').get(id).count;
  if (forumCount > 0 || boardCount > 0) {
    return c.json({ error: 'Cannot delete group: It is assigned as a moderator group for forums or boards' }, 400);
  }

  // Delete group memberships
  db.prepare('DELETE FROM group_memberships WHERE group_id = ?').run(id);

  // Delete permissions associated with the group
  db.prepare('DELETE FROM permissions WHERE entity_type = ? AND entity_id = ?').run('group', id);

  // Delete group
  db.prepare('DELETE FROM groups WHERE id = ?').run(id);
  return c.json({ message: 'Group deleted' });
});

// module.exports = groups;

export default groups;