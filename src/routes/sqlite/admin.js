/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { scriptHtml02 } from '../pages.js';
import { getDB } from '../../db/sqlite/sqlite_db.js';
import { authenticate, authorize } from '../../middleware/sqlite/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});

route.get('/api/report', async (c)=>{
  
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM reports`);
    const results = stmt.all();

    return c.json(results);
  } catch (error) {
    return c.json({api:'ERROR'});
  }
  // if(results){
  //   return c.json(results);
  // }else{
  //   return c.json(JSON.stringify({api:'ERROR'}));
  // }
});

route.post('/api/report',async (c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  console.log("REPORT: ");
  console.log(data);

  const results = db.create_report(data.title,data.content);
  console.log("results", results);
  if(results){
    return c.json(results);
  }else{
    return c.json(JSON.stringify({api:'ERROR'}));
  }
});

route.get('/admin/logs', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

route.get('/api/admin/logs', authenticate, authorize('audit_logs', null, 'manage'), async (c) => {    
  try {
    const db = await getDB();
    const stmt = db.prepare('SELECT * FROM audit_logs');
    const groups = stmt.all();
    return c.json(groups);
  } catch (error) {
    return c.json({error:"error logs"})
  }

  // return c.html(pageHtml);
});



route.get('/admin/accounts', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

route.get('/admin/tickets', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

route.get('/admin/reports', (c) => {
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

export default route;