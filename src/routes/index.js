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

import auth from './sqlite/auth.js';
// import blog from './routes/blog.js';

import pages, { scriptHtml02 } from './pages.js';
import admin from './sqlite/admin/index.js';
// import message from './message.js';

import forum from './sqlite/forums.js';
import board from './sqlite/boards.js';
import topic from './sqlite/topics.js';
import comment from './sqlite/comments.js';
import groups from './sqlite/groups.js';
import permissions from './sqlite/permissions.js';
import backup from './sqlite/backup.js';
import database from './sqlite/database.js';

import maintenance from '../utils/maintenance.js';

route.route('/', maintenance);
route.route('/', auth);
// app.route('/', message);
// app.route('/', blog);
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