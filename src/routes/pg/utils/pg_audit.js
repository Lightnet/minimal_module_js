import { getPool } from '../db/pg/pg_pool.js';

export async function logAudit(userId, action, details) {
  try {
    const pool = getPool();
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, action, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Error logging audit:', err.stack);
  }
}