/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { scriptHtml02 } from '../../pages.js';
import { authenticate, authorize } from '../../../middleware/sqlite/sqlite_auth.js';

import audit_logs from './admin_logs.js';
import admin_reports from './admin_reports.js';
import admin_tickets from './admin_tickets.js';
import admin_accounts from './admin_accounts.js';
import admin_backup from './admin_backup.js';
import { getDB } from '../../../db/sqlite/sqlite_db.js';


// Fallback admin roles from file
async function getFallbackAdmins() {
  try {
    const data = await fs.readFile('fallback_admins.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

const route = new Hono({ 
  //strict: false 
});
route.route('/', admin_backup);
route.route('/', audit_logs);
route.route('/api/admin/', admin_accounts);
route.route('/api/', admin_reports);
route.route('/api/', admin_tickets);

//page
route.get('/admin/logs', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/reports', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/accounts', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/tickets', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/backup', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/settings', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/database', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/groups', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
route.get('/admin/permissions', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

export default route;