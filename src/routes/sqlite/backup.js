// 
import { Hono } from 'hono';
import Database from 'better-sqlite3';

// process.env.DATABASE_PATH

// Initialize Hono app
const app = new Hono();

// Your SQLite database
// Initialize database with DATABASE_PATH from .env
const db = new Database(process.env.DATABASE_PATH || 'database.sqlite');

const savePath = './backups'

// Route to trigger backup
app.get('/backup', async (c) => {
  try {
    const backupPath = `${savePath}/backup-${Date.now()}.db`;
    await db.backup(backupPath);
    return c.json({ message: 'Backup completed', backupPath });
  } catch (error) {
    console.error('Backup failed:', error);
    return c.json({ error: 'Backup failed' }, 500);
  }
});

// Endpoint to list all tables
app.get('/backup/tables', (c) => {
  try {
    const tables = db
      .prepare(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `)
      .all()
      .map(row => row.name);

    return c.json({ tables });
  } catch (error) {
    console.error('Failed to list tables:', error);
    return c.json({ error: 'Failed to list tables' }, 500);
  }
});

// Endpoint for specific table backup
app.get('/backup-table/:tableName', async (c) => {
  const tableName = c.req.param('tableName');
  const backupPath = `${savePath}/backup-${tableName}-${Date.now()}.db`;

  // Validate table name to prevent SQL injection
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return c.json({ error: 'Invalid table name. Use alphanumeric characters and underscores only.' }, 400);
  }

  try {
    // Verify table exists in source database
    const tableExists = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
      .get(tableName);
    console.log('tableExists:', tableExists); // Debugging log

    if (!tableExists) {
      // Get list of existing tables for helpful error message
      const tables = db
        .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
        .all()
        .map(row => row.name);
      return c.json({
        error: `Table "${tableName}" does not exist.`,
        availableTables: tables,
        suggestion: `Did you mean one of these: ${tables.join(', ')}?`
      }, 404);
    }

    // Create a new backup database
    const backupDb = new Database(backupPath);

    // Attach source database using DATABASE_PATH
    backupDb.exec(`ATTACH DATABASE '${process.env.DATABASE_PATH || 'database.sqlite'}' AS source_db`);

    // Copy table structure and data (use quoted table name)
    backupDb.exec(`
      CREATE TABLE "${tableName}" AS SELECT * FROM source_db."${tableName}";
    `);

    // Detach source database and close backup database
    backupDb.exec('DETACH DATABASE source_db');
    backupDb.close();

    return c.json({ message: `Backup of table ${tableName} completed`, backupPath });
  } catch (error) {
    console.error('Table backup failed:', error);
    return c.json({ error: `Table backup failed: ${error.message}` }, 500);
  }
});

// Start server
export default app;
