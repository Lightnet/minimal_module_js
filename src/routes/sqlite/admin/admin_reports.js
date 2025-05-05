/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { scriptHtml02 } from '../../pages.js';
import { getDB } from '../../../db/sqlite/sqlite_db.js';
import { authenticate, authorize } from '../../../middleware/sqlite/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});
// get reports
route.get('/report', authenticate, async (c)=>{
  
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM reports`);
    const results = stmt.all();

    return c.json(results);
  } catch (error) {
    return c.json({api:'ERROR'});
  }
});
// create report
route.post('/report', authenticate, async (c)=>{
  const {title, reason, resource_type, resource_id} = await c.req.json();
  const data = await c.req.json();
  console.log("data: ", data);

  try {
    const user = c.get('user');
    const db = await getDB();
    const stmt = db.prepare('INSERT INTO reports (reporter_id, resource_type, resource_id, title, reason) VALUES (?, ?, ?, ?, ?)');
    const results = stmt.run(user.id, resource_type, resource_id, title, reason);
    console.log(results);
    return c.json({api:"CREATED"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
});
// update report
route.put('/report', authenticate, async (c)=>{
  
  const data = await c.req.json();
  console.log("data: ", data);
  // const {title, type, content} = await c.req.json();

  try {
    const user = c.get('user');
    const db = await getDB();
    // const stmt = db.prepare(`UPDATE tickets SET status=? WHERE id=?`);
    // const results = stmt.run(status, id);
    // console.log(results);
    return c.json({api:"UPDATE"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
});
// delete report
route.delete('/report/:id', authenticate, async (c)=>{
  console.log("DELETE REPORT...")
  try {
    const { id } = c.req.param();
    const db = await getDB();
    const stmt = db.prepare('DELETE FROM reports WHERE id = ?');
    const result = stmt.run(id);
    console.log(result);
    return c.json({api:"DELETE"});
  } catch (error) {
    console.log("error: ",error.message);
    return c.json({api:"ERROR"});
  }
});

export default route;