/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getDB } from '../db/sqlite_db.js';
import { authenticate } from '../middleware/sqlite_auth.js';

const route = new Hono();
// GET BLOGS
route.get('/api/blog', async (c)=>{
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM blogs`);
    const results = stmt.all();
    return c.json(results);
  } catch (error) {
    return c.json({api:"error"});
  }

})
// CREATE
route.post('/api/blog', authenticate, async(c)=>{
  try {
    const data = await c.req.json();
    console.log("data:", data);
    const {title, content} = await c.req.json();

    const db = await getDB();
    const stmt = db.prepare('INSERT INTO blogs (title, content) VALUES (?, ?)');
    const results = stmt.run(title, content);
    console.log(results);
    return c.json({api:"CREATE"});
  } catch (error) {
    console.log("error: ", error.message);
    return c.json({api:"error"});
  }
  
})
// UPDATE
route.put('/api/blog/:id', authenticate,async (c)=>{
  try {
    const { id } = c.req.param();
    const {title, content} = await c.req.json();
    const db = await getDB();
    const stmt = db.prepare('UPDATE blogs SET title=?, content=? WHERE id=?;')
    stmt.run(title, content, id);
    return c.json({api:'UPDATE'});
  } catch (error) {
    return c.json({error:'error'});
  }
})
//DELETE
route.delete('/api/blog/:id', authenticate, async (c)=>{
  try {
    const { id } = c.req.param();
    const db = await getDB();
    const stmt = db.prepare('DELETE FROM blogs WHERE id=?')
    stmt.run(id);
    return c.json({api:'DELETE'});
  } catch (error) {
    return c.json({api:'ERROR'});
  }
})

export default route;