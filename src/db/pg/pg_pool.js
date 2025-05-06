import { Pool } from 'pg';
import { config } from 'dotenv';

config();

let poolInstance = null;

function getPool() {
  if (poolInstance) {
    return poolInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env file');
  }

  try {
    poolInstance = new Pool({
      connectionString: databaseUrl,
    });
    console.log('PostgreSQL pool created successfully');
    return poolInstance;
  } catch (err) {
    console.error('Error creating PostgreSQL pool:', err.stack);
    throw err;
  }
}

export { getPool };