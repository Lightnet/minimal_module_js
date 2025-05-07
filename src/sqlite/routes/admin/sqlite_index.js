/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from '../../../routes/pages.js';
import audit_logs from './sqlite_admin_logs.js';
import admin_reports from './sqlite_admin_reports.js';
import admin_tickets from './sqlite_admin_tickets.js';
import admin_accounts from './sqlite_admin_accounts.js';
import admin_backup from './sqlite_admin_backup.js';


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

// route.use('/admin/*', async (c, next) => {
//   if (!isSetupComplete) {
//     return c.json({ error: 'Admin setup not complete. Please run /setup.' }, 403);
//   }
//   // Add authentication check here (e.g., JWT or session)
//   const user = c.get('user'); // Assume user is set by auth middleware
//   if (!user || user.role !== 'admin') {
//     return c.json({ error: 'Unauthorized. Admin access required.' }, 403);
//   }
//   await next();
// });

export default route;