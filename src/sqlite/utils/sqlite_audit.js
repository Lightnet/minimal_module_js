/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { authenticate, authorize } from '../middleware/sqlite_auth.js';
import { getDB } from '../db/sqlite_db.js';

// for logging access for groups, permssions. 
export async function logAudit(userId, action, details) {
  try {
    console.log("[logAudit] TEST");
    const db = await getDB();
    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_id, action, details)
      VALUES (?, ?, ?)
    `);
    stmt.run(
      userId,
      action,
      details ? JSON.stringify(details) : null
    );
  } catch (error) {
    console.log("[logAudit] Audit log error!");
    console.error('Audit log error:', error.message);
    // Don't throw; logging failures shouldn't block the main operation
  }
  console.log("[logAudit] FINISHED...")
}

const route_audit_logs = new Hono();
route_audit_logs.get('/audit_logs', authenticate, authorize('audit_logs', null, 'manage'), async (c) => {
  const stmt = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC');
  return c.json(stmt.all());
});

export {
  route_audit_logs
}

// module.exports = { logAudit };