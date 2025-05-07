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
import auth from './auth/pg_auth.js';
import admin from './admin/index.js';

import forum from './forum/pg_forums.js';
import board from './forum/pg_boards.js';
import topic from './forum/pg_topics.js';
import comment from './forum/pg_comments.js';
import groups from './auth/pg_groups.js';
import permissions from './auth/pg_permissions.js';
import maintenance from '../utils/pg_maintenance.js';

import backup from './pg_backup.js';
import database from './pg_database.js';

const route = new Hono({ 
  //strict: false 
});

route.route('/', maintenance);
route.route('/', auth);
route.route('/', admin);
route.route('/', forum);
route.route('/', board);
route.route('/', topic);
route.route('/', comment);
route.route('/', database);
route.route('/api/', groups);
route.route('/api/', permissions);
route.route('/api/', backup);

export default route;