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

import auth from './auth.js';
import blog from './blog.js';

import pages, { scriptHtml02 } from '../pages.js';
import admin from './admin/index.js';
import message from './message.js';

import forum from './forums.js';
import board from './boards.js';
import topic from './topics.js';
import comment from './comments.js';
import groups from './groups.js';
import permissions from './permissions.js';
import backup from './backup.js';
import database from './database.js';

import maintenance from './utils/maintenance.js';
import localdb from '../local/index.js';;

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