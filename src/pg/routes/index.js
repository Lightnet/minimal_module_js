/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
// import { loadSqlFile } from '../../db/pg/load_sql.js';
// loadSqlFile();
console.log("pg index.js");
import auth from './pg_auth.js';

import forum from './pg_forums.js';
import board from './pg_boards.js';
import topic from './pg_topics.js';
import comment from './pg_comments.js';
import groups from './pg_groups.js';
import permissions from './pg_permissions.js';

const route = new Hono({ 
  //strict: false 
});

route.route('/', auth);
route.route('/', forum);
route.route('/', board);
route.route('/', topic);
route.route('/', comment);
route.route('/api/', groups);
route.route('/api/', permissions);

export default route;