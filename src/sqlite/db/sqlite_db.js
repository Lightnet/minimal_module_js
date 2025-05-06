/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import initializeDatabase from "./sqlite_init.js";
import { config } from "dotenv";
config();

const db = initializeDatabase(process.env.DATABASE_PATH);
// db.pragma('foreign_keys = ON'); // Ensure foreign keys are enabled

let dbInstance;
// Initialize the database asynchronously
async function getDB() {
  if (!dbInstance) {
    dbInstance = await initializeDatabase(process.env.DATABASE_PATH); // Await the async initialization
  }
  return dbInstance;
}

export{
  db,
  getDB
}

export default db;