/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
// import { scriptHtml02 } from '../pages.js';
// import db from '../../db/sqlite/sqlite_db.js';
import { getDB } from '../../db/sqlite/sqlite_db.js';
import { authenticate, authorize } from '../../middleware/sqlite/sqlite_auth.js';
const route = new Hono();

// topic get list parent id
route.get('/api/topics/:id', authenticate, authorize('topic', null, 'read'), async (c)=>{
  try {
    const id = c.req.param('id');
    console.log("BOARDS: ", id);
    const db = await getDB();
    const stmt = db.prepare('SELECT * FROM topics WHERE board_id = ?');
    const results = stmt.all(id);
    console.log("TOPICS:", results);
    return c.json(results);  
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})
// TOPIC CREATE
route.post('/api/topic', authenticate, authorize('topic', null, 'create'), async (c)=>{
  try {
    const db = await getDB();
    const { title, content, parentid } = await c.req.json();
    console.log("title:", title);
    console.log("content:", content);
    console.log("parentid:", parentid);
    const user = c.get('user');
    console.log("user:",user);
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`INSERT INTO topics (board_id, user_id, title, content)
      VALUES (?, ?, ?, ?)`);
    const result = stmt.run(parentid, user.id, title, content);
    return c.json({api:"CREATE"});
  } catch (error) {
    console.log("BOARD CREATE ERROR",error.message);
    return c.json({api:"ERROR"});
  }

})
// TOPIC UPDATE
route.put('/api/topic/:id', authenticate, authorize('topic', null, 'update'), async (c)=>{
  const { id } = c.req.param();
  try {
    const db = await getDB();
    console.log("BOARD UPDATE?");
    const { title, content } = await c.req.json();
    console.log("ID: ", id);
    console.log("title: ", title);
    console.log("content: ", content);
    const user = c.get('user');
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`UPDATE topics SET title=?, content=? WHERE id=?`);
    const result = stmt.run(title, content, id);
    console.log("result: ", result);

    return c.json({api:"UPDATE"});
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})
// TOPIC DELETE
route.delete('/api/topic/:id', authenticate, authorize('topic', null, 'delete'), async (c)=>{
  try {
    const db = await getDB();
    const { id } = c.req.param();
    const topicId = parseInt(id, 10);

    const stmt = db.prepare('DELETE FROM topics WHERE id = ?');
    stmt.run(topicId);
    console.log("DELETE...");
    return c.json({api:'DELETE'});
  } catch (error) {
    return c.json({api:'ERROR'});
  }
})
// GET TOPIC ID
// route.get('/api/topic/:id', authenticate, authorize('topic', null, 'read'), async(c)=>{
//   return c.json({api:"ERROR"});
// })

export default route;