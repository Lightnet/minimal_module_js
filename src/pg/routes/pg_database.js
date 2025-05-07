/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import fs from 'fs/promises';
import { getPool } from '../db/pg_pool.js';
import van from "mini-van-plate/van-plate";
import { checkUserExists } from '../models/pg_user.js';
import { hashPassword } from '../../helpers.js';

const adminCache = new Map();

// Cache admin roles
async function cacheAdmins() {
  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, role FROM users WHERE role IN ($1, $2)',
      ['admin', 'super_admin']
    );
    console.log('Cached admins:', result.rows);
    result.rows.forEach(({ id, role }) => adminCache.set(id, role));
  } catch (err) {
    console.error('Failed to cache admins:', err.stack);
  }
}

// Check role from cache if DB is down
export async function getUserRoleWithFallback(userId) {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.role;
  } catch (err) {
    console.error('Database unavailable, using cache:', err.stack);
    return adminCache.get(userId); // Fallback to cache
  }
}

// Load fallback admins from JSON file
async function fallbackAdmins() {
  try {
    const data = await fs.readFile('fallback_admins.json', 'utf8');
    return JSON.parse(data); // { [userId]: role }
  } catch (err) {
    console.error('Failed to read fallback admins:', err.stack);
    return {};
  }
}

// Get user role with fallback
export async function getUserRole(userId) {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.role;
  } catch (err) {
    console.error('Database unavailable:', err.stack);
    const cachedRole = adminCache.get(userId);
    if (cachedRole) return cachedRole;
    const fallback = await fallbackAdmins();
    return fallback[userId];
  }
}

// Check role with file fallback
async function getUserRoleWithFileFallback(userId) {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.role;
  } catch (err) {
    console.error('Database unavailable, using file fallback:', err.stack);
    const admins = await fallbackAdmins();
    return admins[userId];
  }
}

// Save fallback admins to JSON file
async function saveFallbackAdmins() {
  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, role FROM users WHERE role IN ($1, $2)',
      ['admin', 'super_admin']
    );
    const adminData = result.rows.reduce((acc, { id, role }) => {
      acc[id] = role;
      return acc;
    }, {});

    await fs.writeFile('fallback_admins.json', JSON.stringify(adminData, null, 2), 'utf8');
    await fs.chmod('fallback_admins.json', 0o600);
    console.log('fallback_admins.json saved successfully');
  } catch (err) {
    console.error('Failed to save fallback_admins.json:', err.stack);
  }
}

// Database health check
export async function checkDbHealth() {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database health check failed:', err.stack);
    return false;
  }
}

const route = new Hono({ 
  // strict: false 
});

// Test for failure
route.get('/api/database/data', async (c) => {
  try {
    console.log('/api/database/data');
    const pool = getPool();
    const result = await pool.query('SELECT * FROM some_table');
    console.log(result.rows);
    return c.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.stack);
    return c.json({ error: 'Service unavailable' }, 503);
  }
});

// Database status
route.get('/api/database/status', async (c) => {
  const isDb = await checkDbHealth();
  const isMaintenanceMode = false; // Placeholder; implement getMaintenanceState if needed
  return c.json({ maintenance: isMaintenanceMode, dbStatus: isDb ? 'up' : 'down' });
});

// List tables
route.get('/api/database/tables', async (c) => {
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
    console.error('Error fetching tables:', error.stack);
    return c.json({ error: 'ERROR' }, 500);
  }
});

// Admin setup form
route.get('/setup', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");
    const adminExists = result.rows[0].count > 0;
    console.log('Admin exists:', adminExists);
    if(adminExists){
      return c.text('404 Not Found', 404);
    }

    return c.html(
      van.html(
        van.tags.body(
          van.tags.p('Admin setup'),
          van.tags.form({ method: 'POST', action: '/setup' }, // Changed url to action
            van.tags.div(
              van.tags.label('User Name:'),
              van.tags.input({ value: 'test', name: 'username' })
            ),
            van.tags.div(
              van.tags.label('Passphrase:'),
              van.tags.input({ value: 'test', name: 'passphrase', type: 'password' }) // Added type
            ),
            van.tags.div(
              van.tags.label('Email:'),
              van.tags.input({ value: 'test', name: 'email', type: 'text' }) // Added type
              // van.tags.input({ value: 'admin@example.com', name: 'email', type: 'email' }) // Added type
            ),
            van.tags.div(),
            van.tags.div(
              van.tags.button({ type: 'submit' }, 'Register')
            )
          )
        )
      )
    );
  } catch (error) {
    console.error('Error checking admin existence:', error.stack);
    return c.json({ error: 'Database error' }, 500);
  }
});

// Admin setup submission
route.post('/setup', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");
    const adminExists = result.rows[0].count > 0;
    console.log('Admin exists:', adminExists);

    let { username, passphrase, email } = await c.req.parseBody();
    console.log('parseBody:', { username, passphrase, email });

    if (username && passphrase) {
      console.log('FOUND');
      console.log('username:', username);
      console.log('passphrase:', passphrase);
      console.log('email:', email);

      const userExists = await checkUserExists({ username, email });
      if (!userExists) {
        const { salt, hash } = hashPassword(passphrase);
        const role = 'admin';
        const insertResult = await pool.query(
          `INSERT INTO users (username, email, password_hash, role, salt)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [username, email, hash, role, salt]
        );
        console.log('Insert result:', insertResult.rows[0]);
        return c.text('CREATE', 200);
      }
    }
    return c.text('404 Not Found', 404);
  } catch (error) {
    console.error('Error creating admin:', error.stack);
    return c.text('500 Internal Server Error', 500);
  }
});

export default route;

// Optional: Periodically refresh cache
// import { schedule } from 'node-cron';
// schedule('0 * * * *', saveFallbackAdmins); // Runs every hour
// schedule('0 * * * *', cacheAdmins); // Runs every hour
// cacheAdmins(); // Initial cache
// saveFallbackAdmins(); // Initial save