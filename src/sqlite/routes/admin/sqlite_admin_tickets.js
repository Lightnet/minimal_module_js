/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
// import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { getDB } from '../../db/sqlite_db.js';
import { authenticate, authorize } from '../../middleware/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});
// GET TICKETS
route.get('/ticket', authenticate, async (c)=>{
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM tickets`);
    const results = stmt.all();
    console.log("results:", results);

    return c.json(results);
  } catch (error) {
    return c.json({api:'ERROR'});
  }
});
// CREATE TICKET
route.post('/ticket', authenticate, async (c)=>{
  const {title, description, resource_type, resource_id, category} = await c.req.json();
  const data = await c.req.json();
  console.log("data: ", data);

  try {
    const user = c.get('user');
    const db = await getDB();
    const stmt = db.prepare('INSERT INTO tickets (reporter_id, resource_type, resource_id, title, description, category) VALUES (?, ?, ?, ?, ?, ?)');
    const results = stmt.run(user.id, resource_type, resource_id, title, description, category);
    console.log(results);
    return c.json({api:"CREATED"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
});
// UPDATE TICKET
route.put('/ticket/:id', authenticate, async (c)=>{
  const { id } = c.req.param();
  const {status} = await c.req.json();
  const data = await c.req.json();
  console.log("data: ", data);
  try {
    const user = c.get('user');
    const db = await getDB();
    if(status){
      const stmt = db.prepare(`UPDATE tickets SET status=? WHERE id=?`);
      const results = stmt.run(status, id);
      console.log(results);
    }
    
    return c.json({api:"UPDATE"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
});
// DELETE TICKET
route.delete('/ticket/:id', authenticate, async (c)=>{
  try {
    const { id } = c.req.param();
    const db = await getDB();
    const stmt = db.prepare('DELETE FROM tickets WHERE id = ?');
    const result = stmt.run(id);
    console.log(result);
    return c.json({api:"DELETE"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
});

export default route;