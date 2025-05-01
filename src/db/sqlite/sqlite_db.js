// const Database = require('better-sqlite3');
// const initializeDatabase = require('./init');
// require('dotenv').config();
// import Database from "better-sqlite3";
import initializeDatabase from "./sqlite_init.js";
import { config } from "dotenv";
config();

const db = initializeDatabase(process.env.DATABASE_PATH);
db.pragma('foreign_keys = ON'); // Ensure foreign keys are enabled

//module.exports = db;
export{
  db
}

export default db;