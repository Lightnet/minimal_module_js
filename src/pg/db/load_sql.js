/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { getPool } from './pg_pool.js'; // Adjust the path to your pg_pool.js file
import fs from 'fs/promises'; // Use promises-based fs for async/await
import { config } from 'dotenv';

config(); // Load environment variables

export async function loadSqlFile() {
  const pool = getPool();
  try {
    // Read the SQL file
    const sql = await fs.readFile('./src/db/pg/pg.sql', 'utf8');
    // Connect to the database and execute the SQL
    // const client = await pool.connect();
    try {
      await pool.query(sql);
      console.log('SQL file executed successfully');
    } finally {
      // Release the client back to the pool
      pool.release();
    }
  } catch (err) {
    console.error('Error executing SQL file:', err.stack);
  } finally {
    // Close the pool (optional, depending on whether you want to keep the pool open)
    // await pool.end();
    console.log('Database connection closed');
  }
}

// Run the script
// loadSqlFile();
//=================
// node load_sql.js
//=================
// psql -U username -d database_name -f sql.sql
//=================