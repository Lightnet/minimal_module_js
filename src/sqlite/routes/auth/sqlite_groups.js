// const { Hono } = require('hono');
// const { authenticate, authorize } = require('../middleware/auth');
// const pool = require('../db');
import { Hono } from 'hono';
import { authenticate, authorize } from '../../middleware/sqlite_auth.js';
// import db from '../../db/sqlite/sqlite_db.js';
import { getDB } from '../../db/sqlite_db.js';
import { logAudit } from '../../utils/sqlite_audit.js';
const groups = new Hono();

// Get all groups
groups.get('groups', async (c) => {
  const db = await getDB();
  const stmt = db.prepare('SELECT id, name, description, created_at FROM groups');
  const groups = stmt.all();
  return c.json(groups);
});
// Create a new group
groups.post('groups', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { name, description } = await c.req.json();
  // console.log("[post] name: ", name);
  // console.log("description: ", description);
  if (!name) {
    return c.json({ error: 'Group name is required' }, 400);
  }
  // console.log("user: ", user);
  // console.log("user.id: ", user.id);
  
  try {
    const db = await getDB();
    const stmt = db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)');
    const result = stmt.run(name, description || null);
    const newGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(result.lastInsertRowid);

    await logAudit(user.id, 'create_group', { group_id: newGroup.id, name, description });
    return c.json({api:'CREATE', newGroup});
  } catch (error) {
    // console.log("[GROUP] ERROR!", error.message);
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Group name already exists' }, 400);
    }
    return c.json({ error: 'Failed to create group' }, 500);
  }
});
// Update a group
groups.put('group/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const { name, description } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Group name is required' }, 400);
  }
  const db = await getDB();
  const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(id);
  if (!group) {
    return c.json({ error: 'Group not found' }, 404);
  }

  try {
    const stmt = db.prepare('UPDATE groups SET name = ?, description = ? WHERE id = ?');
    stmt.run(name, description || null, id);
    const updatedGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(id);

    await logAudit(user.id, 'update_group', { group_id: id, name, description });
    return c.json(updatedGroup);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Group name already exists' }, 400);
    }
    return c.json({ error: 'Failed to update group' }, 500);
  }
});
// Assign a user to a group
groups.post('groups/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { userId, groupId } = await c.req.json();

  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }
  const db = await getDB();
  const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!targetUser) {
    return c.json({ error: 'User does not exist' }, 400);
  }

  const group = db.prepare('SELECT id, name FROM groups WHERE id = ?').get(groupId);
  if (!group) {
    return c.json({ error: 'Group does not exist' }, 400);
  }

  try {
    const stmt = db.prepare('INSERT INTO group_memberships (user_id, group_id) VALUES (?, ?)');
    stmt.run(userId, groupId);
    
    await logAudit(user.id, 'add_group_membership', { user_id: userId, group_id: groupId, group_name: group.name });
    return c.json({ userId, groupId, joined_at: new Date().toISOString() }, 201);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'User is already a member of this group' }, 400);
    }
    return c.json({ error: 'Failed to assign user to group' }, 500);
  }
});
// Remove a user from a group
groups.delete('groups/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { userId, groupId } = await c.req.json();

  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }
  const db = await getDB();
  const membership = db.prepare(
    'SELECT user_id, group_id FROM group_memberships WHERE user_id = ? AND group_id = ?'
  ).get(userId, groupId);
  if (!membership) {
    return c.json({ error: 'User is not a member of this group' }, 404);
  }

  console.log("membership:", membership)

  const stmt = db.prepare('DELETE FROM group_memberships WHERE user_id = ? AND group_id = ?');
  stmt.run(userId, groupId);

  // await logAudit(user.id, 'remove_group_membership', { user_id: userId, group_id: groupId, group_name: group.name });
  await logAudit(user.id, 'remove_group_membership', { user_id: userId, group_id: groupId });
  return c.json({ message: 'User removed from group' });
});
// Delete a group
groups.delete('groups/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  console.log("id:", id);
  const db = await getDB();
  
  const group = db.prepare('SELECT id FROM groups WHERE id = ?').get(id);
  if (!group) {
    return c.json({ error: 'Group not found' }, 404);
  }
  
  const forumCount = db.prepare('SELECT COUNT(*) as count FROM forums WHERE moderator_group_id = ?').get(id).count;
  const boardCount = db.prepare('SELECT COUNT(*) as count FROM boards WHERE moderator_group_id = ?').get(id).count;
  if (forumCount > 0 || boardCount > 0) {
    return c.json({ error: 'Cannot delete group: It is assigned as a moderator group' }, 400);
  }

  db.prepare('DELETE FROM group_memberships WHERE group_id = ?').run(id);
  db.prepare('DELETE FROM permissions WHERE entity_type = ? AND entity_id = ?').run('group', id);
  db.prepare('DELETE FROM groups WHERE id = ?').run(id);

  await logAudit(user.id, 'delete_group', { group_id: id, name: group.name });
  return c.json({ message: 'Group deleted' });
});
// List group memberships
groups.get('groups/memberships/:groupId', authenticate, authorize('group', null, 'manage'), async (c) => {
  // const { groupId } = c.req.query();
  const { groupId } = c.req.param();
  console.log(groupId);
  let stmt;
  const db = await getDB();
  if (groupId) {
    stmt = db.prepare(`
      SELECT user_id, group_id, joined_at
      FROM group_memberships
      WHERE group_id = ?
    `);
    return c.json(stmt.all(groupId));
  }
  stmt = db.prepare('SELECT user_id, group_id, joined_at FROM group_memberships');
  return c.json(stmt.all());
});

// Serve groups management HTML
// groups.get('groups/manage', authenticate, authorize('group', null, 'manage'), async (c) => {
//   const html = fs.readFileSync(path.join(__dirname, '../public/groups.html'), 'utf8');
//   return c.html(html);
// });

// module.exports = groups;

export default groups;