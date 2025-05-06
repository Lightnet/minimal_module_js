import { Hono } from 'hono';
// import { loadSqlFile } from '../../db/pg/load_sql.js';
// loadSqlFile();
console.log("pg index.js");
import auth from './auth.js';

const route = new Hono({ 
  //strict: false 
});

route.route('/', auth);

export default route;