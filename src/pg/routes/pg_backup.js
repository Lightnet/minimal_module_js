/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { getPool } from '../db/pg_pool.js';
import { authenticate, authorize } from '../middleware/pg_auth.js';

const app = new Hono();
const savePath = './backups';
const backupType = process.env.BACKUP_TYPE || 'sql'; // Default to sql

// Validate BACKUP_TYPE
if (!['sql', 'json'].includes(backupType)) {
  console.error(`Invalid BACKUP_TYPE: ${backupType}. Must be 'sql' or 'json'. Defaulting to 'sql'.`);
  process.env.BACKUP_TYPE = 'sql';
}

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fs.mkdir(savePath, { recursive: true });
  } catch (error) {
    console.error('Failed to create backup directory:', error.stack);
    throw error;
  }
}

// Route to trigger full database backup
app.get('/backup', authenticate, authorize('backup', null, 'manage'), async (c) => {
  try {
    await ensureBackupDir();
    const timestamp = Date.now();
    const extension = backupType === 'json' ? 'json' : 'sql';
    const backupFile = `backup-${timestamp}.${extension}`;
    const backupPath = path.join(savePath, backupFile);

    if (backupType === 'json') {
      const pool = getPool();
      // Get all tables
      const tablesResult = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);
      const tables = tablesResult.rows.map(row => row.table_name);

      // Export each table's data
      const backupData = {};
      for (const table of tables) {
        const dataResult = await pool.query(`SELECT * FROM "${table}"`);
        backupData[table] = dataResult.rows;
      }

      // Save as JSON
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
    } else {
      // Run pg_dump
      const pgDump = spawn(process.env.PG_DUMP, [
        '--host=localhost',
        '--port=5432',
        '--username=postgres',
        '--format=plain',
        '--file=' + backupPath,
        'postgres',
      ], {
        env: { ...process.env, PGPASSWORD: process.env.PG_PASSWORD || 'your_secure_password' },
      });

      const [code, error] = await new Promise((resolve) => {
        let error = '';
        pgDump.stderr.on('data', (data) => error += data.toString());
        pgDump.on('close', (code) => resolve([code, error]));
      });

      if (code !== 0) {
        console.error('pg_dump failed:', error);
        return c.json({ error: 'Backup failed: ' + error }, 500);
      }
    }

    return c.json({ message: 'Backup completed', backupPath });
  } catch (error) {
    console.error('Backup failed:', error.stack);
    return c.json({ error: 'Backup failed: ' + error.message }, 500);
  }
});

// Endpoint to list all tables
app.get('/backup/tables', authenticate, authorize('backup', null, 'manage'), async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT table_name AS name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `);
    const tables = result.rows.map(row => row.name);
    return c.json({ tables });
  } catch (error) {
    console.error('Failed to list tables:', error.stack);
    return c.json({ error: 'Failed to list tables' }, 500);
  }
});

// Endpoint for specific table backup
app.get('/backup-table/:tableName', authenticate, authorize('backup', null, 'manage'), async (c) => {
  const tableName = c.req.param('tableName').toLowerCase();
  const timestamp = Date.now();
  const extension = backupType === 'json' ? 'json' : 'sql';
  const backupFile = `backup-${tableName}-${timestamp}.${extension}`;
  const backupPath = path.join(savePath, backupFile);

  // Validate table name
  if (!/^[a-z0-9_]+$/.test(tableName)) {
    return c.json({ error: 'Invalid table name. Use lowercase alphanumeric characters and underscores only.' }, 400);
  }

  try {
    const pool = getPool();

    // Verify table exists
    const tableExists = await pool.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = $1`,
      [tableName]
    );
    if (tableExists.rows.length === 0) {
      const tablesResult = await pool.query(
        `SELECT table_name AS name FROM information_schema.tables
         WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
      );
      const tables = tablesResult.rows.map(row => row.name);
      return c.json({
        error: `Table "${tableName}" does not exist.`,
        availableTables: tables,
        suggestion: `Did you mean one of these: ${tables.join(', ')}?`
      }, 404);
    }

    await ensureBackupDir();

    if (backupType === 'json') {
      // Query table data
      const result = await pool.query(`SELECT * FROM "${tableName}"`);
      const data = result.rows;
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf8');
    } else {
      // Run pg_dump for table
      const pgDump = spawn(process.env.PG_DUMP, [
        '--host=localhost',
        '--port=5432',
        '--username=postgres',
        '--format=plain',
        '--table=public.' + tableName,
        '--file=' + backupPath,
        'postgres',
      ], {
        env: { ...process.env, PGPASSWORD: process.env.PG_PASSWORD || 'your_secure_password' },
      });

      const [code, error] = await new Promise((resolve) => {
        let error = '';
        pgDump.stderr.on('data', (data) => error += data.toString());
        pgDump.on('close', (code) => resolve([code, error]));
      });

      if (code !== 0) {
        console.error('pg_dump table failed:', error);
        return c.json({ error: 'Table backup failed: ' + error }, 500);
      }
    }

    return c.json({ message: `Backup of table ${tableName} completed`, backupPath });
  } catch (error) {
    console.error('Table backup failed:', error.stack);
    return c.json({ error: `Table backup failed: ${error.message}` }, 500);
  }
});

export default app;