/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { scriptHtml02 } from '../pages.js';

const route = new Hono({ 
  //strict: false 
});

route.get('/api/report',(c)=>{
  const db = c.get('db');
  const results = db.get_reports();
  //console.log(results);
  if(results){
    return c.json(results);
  }else{
    return c.json(JSON.stringify({api:'ERROR'}));
  }
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

route.get('/admin/settings', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

route.get('/admin/database', (c) => {
  const pageHtml = scriptHtml02("/admin.js");
  return c.html(pageHtml);
});

export default route;