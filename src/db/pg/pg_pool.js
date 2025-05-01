// const { Pool } = require('pg');
// require('dotenv').config();
import { pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//module.exports = pool;
export {
  pool
}