/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';

import audit_logs from './pg_admin_logs.js';
import admin_reports from './pg_admin_reports.js';
import admin_tickets from './pg_admin_tickets.js';
import admin_accounts from './pg_admin_accounts.js';
import admin_backup from './pg_admin_backup.js';
import { scriptHtml02 } from '../../../routes/pages.js';

const route = new Hono({ 
  //strict: false 
});
route.route('/', admin_backup);
route.route('/', audit_logs);
route.route('/api/admin/', admin_accounts);
route.route('/api/', admin_reports);
route.route('/api/', admin_tickets);

//pages
route.get('/admin', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});
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