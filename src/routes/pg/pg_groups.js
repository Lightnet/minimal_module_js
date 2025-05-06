/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg/pg_auth.js';
import { logAudit } from './utils/pg_audit.js';

const groups = new Hono();

// Get all groups
groups.get('/groups', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT id, name, description, created_at FROM groups');
    const groupsList = result.rows;
    return c.json(groupsList);
  } catch (err) {
    console.error('Error fetching groups:', err.stack);
    return c.json({ error: 'Failed to fetch groups' }, 500);
  }
});

// Create a new group
groups.post('/groups', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { name, description } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Group name is required' }, 400);
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    const newGroup = result.rows[0];

    await logAudit(user.id, 'create_group', { group_id: newGroup.id, name, description });
    return c.json({ api: 'CREATE', newGroup }, 201);
  } catch (err) {
    console.error('Error creating group:', err.stack);
    if (err.code === '23505') { // PostgreSQL unique violation
      return c.json({ error: 'Group name already exists' }, 400);
    }
    return c.json({ error: 'Failed to create group' }, 500);
  }
});

// Update a group
groups.put('/group/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const { name, description } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Group name is required' }, 400);
  }

  try {
    const pool = getPool();
    const groupResult = await pool.query('SELECT id FROM groups WHERE id = $1', [id]);
    if (!groupResult.rows.length) {
      return c.json({ error: 'Group not found' }, 404);
    }

    const result = await pool.query(
      'UPDATE groups SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );
    const updatedGroup = result.rows[0];

    await logAudit(user.id, 'update_group', { group_id: id, name, description });
    return c.json(updatedGroup);
  } catch (err) {
    console.error('Error updating group:', err.stack);
    if (err.code === '23505') { // PostgreSQL unique violation
      return c.json({ error: 'Group name already exists' }, 400);
    }
    return c.json({ error: 'Failed to update group' }, 500);
  }
});

// Assign a user to a group
groups.post('/groups/membership', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { userId, groupId } = await c.req.json();

  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }

  try {
    const pool = getPool();
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!userResult.rows.length) {
      return c.json({ error: 'User does not exist' }, 400);
    }

    const groupResult = await pool.query('SELECT id, name FROM groups WHERE id = $1', [groupId]);
    if (!groupResult.rows.length) {
      return c.json({ error: 'Group does not exist' }, 400);
    }
    const group = groupResult.rows[0];

    const result = await pool.query(
      'INSERT INTO group_memberships (user_id, group_id) VALUES ($1, $2) RETURNING *',
      [userId, groupId]
    );

    await logAudit(user.id, 'add_group_membership', { user_id: userId, group_id: groupId, group_name: group.name });
    return c.json({ userId, groupId, joined_at: result.rows[0].joined_at }, 201);
  } catch (err) {
    console.error('Error assigning user to group:', err.stack);
    if (err.code === '23505') { // PostgreSQL unique violation
      return c.json({ error: 'User is already a member of this group' }, 400);
    }
    return c.json({ error: 'Failed to assign user to group' }, 500);
  }
});

// Remove a user from a group
groups.delete('/groups/membership', authenticate, async (c) => {
  const user = c.get('user');
  const { userId, groupId } = await c.req.json();

  if (!userId || !groupId) {
    return c.json({ error: 'userId and groupId are required' }, 400);
  }

  try {
    const pool = getPool();
    const membershipResult = await pool.query(
      'SELECT user_id, group_id FROM group_memberships WHERE user_id = $1 AND group_id = $2',
      [userId, groupId]
    );
    if (!membershipResult.rows.length) {
      return c.json({ error: 'User is not a member of this group' }, 404);
    }

    console.log('membership:', membershipResult.rows[0]);

    await pool.query(
      'DELETE FROM group_memberships WHERE user_id = $1 AND group_id = $2',
      [userId, groupId]
    );

    await logAudit(user.id, 'remove_group_membership', { user_id: userId, group_id: groupId });
    return c.json({ message: 'User removed from group' });
  } catch (err) {
    console.error('Error removing user from group:', err.stack);
    return c.json({ error: 'Failed to remove user from group' }, 500);
  }
});

// Delete a group
groups.delete('/groups/:id', authenticate, authorize('group', null, 'manage'), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  console.log('id:', id);

  try {
    const pool = getPool();
    const groupResult = await pool.query('SELECT id, name FROM groups WHERE id = $1', [id]);
    if (!groupResult.rows.length) {
      return c.json({ error: 'Group not found' }, 404);
    }
    const group = groupResult.rows[0];

    const forumCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM forums WHERE moderator_group_id = $1',
      [id]
    );
    const boardCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM boards WHERE moderator_group_id = $1',
      [id]
    );
    const forumCount = parseInt(forumCountResult.rows[0].count, 10);
    const boardCount = parseInt(boardCountResult.rows[0].count, 10);

    if (forumCount > 0 || boardCount > 0) {
      return c.json({ error: 'Cannot delete group: It is assigned as a moderator group' }, 400);
    }

    await pool.query('DELETE FROM group_memberships WHERE group_id = $1', [id]);
    await pool.query(
      'DELETE FROM permissions WHERE entity_type = $1 AND entity_id = $2',
      ['group', id]
    );
    await pool.query('DELETE FROM groups WHERE id = $1', [id]);

    await logAudit(user.id, 'delete_group', { group_id: id, name: group.name });
    return c.json({ message: 'Group deleted' });
  } catch (err) {
    console.error('Error deleting group:', err.stack);
    return c.json({ error: 'Failed to delete group' }, 500);
  }
});

// List group memberships
groups.get('/groups/memberships/:groupId', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { groupId } = c.req.param();
  console.log('groupId:', groupId);

  try {
    const pool = getPool();
    if (groupId) {
      const result = await pool.query(
        'SELECT user_id, group_id, joined_at FROM group_memberships WHERE group_id = $1',
        [groupId]
      );
      return c.json(result.rows);
    }
    const result = await pool.query('SELECT user_id, group_id, joined_at FROM group_memberships');
    return c.json(result.rows);
  } catch (err) {
    console.error('Error fetching group memberships:', err.stack);
    return c.json({ error: 'Failed to fetch group memberships' }, 500);
  }
});

export default groups;