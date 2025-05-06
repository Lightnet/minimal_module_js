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

import auth from './sqlite_auth.js';
import blog from './sqlite_blog.js';

import pages, { scriptHtml02 } from '../../routes/pages.js';
import admin from './admin/sqlite_index.js';
import message from './sqlite_message.js';

import forum from './sqlite_forums.js';
import board from './sqlite_boards.js';
import topic from './topics.js';
import comment from './sqlite_comments.js';
import groups from './sqlite_groups.js';
import permissions from './sqlite_permissions.js';
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