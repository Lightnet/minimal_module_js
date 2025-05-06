/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';

const route = new Hono({ 
  //strict: false 
});

import auth from './auth/sqlite_auth.js';
import blog from './sqlite_blog.js';

import pages from '../../routes/pages.js';
import admin from './admin/sqlite_index.js';
import message from './sqlite_message.js';

import forum from './forum/sqlite_forums.js';
import board from './forum/sqlite_boards.js';
import topic from './forum/sqlite_topics.js';
import comment from './forum/sqlite_comments.js';
import groups from './auth/sqlite_groups.js';
import permissions from './auth/sqlite_permissions.js';
import backup from './sqlite_backup.js';
import database from './sqlite_database.js';

import maintenance from '../utils/sqlite_maintenance.js';
import localdb from '../../routes/local/index.js';;

route.route('/', localdb);
route.route('/', maintenance);
route.route('/', message);
route.route('/', auth);
route.route('/', blog);
route.route('/', forum);
route.route('/', board);
route.route('/', topic);
route.route('/', comment);
route.route('/api/', groups);
route.route('/api/', permissions);
route.route('/', admin);
route.route('/', pages);
route.route('/api/', backup);
route.route('/', database);

export default route;