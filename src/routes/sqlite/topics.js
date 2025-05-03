/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from '../pages.js';
import db from '../../db/sqlite/sqlite_db.js';
import { authenticate } from '../../middleware/sqlite/sqlite_auth.js';
const route = new Hono();

// topic get list parent id
route.get('/api/topics/:id',(c)=>{
  try {
    const id = c.req.param('id');
    console.log("BOARDS: ", id);
    const stmt = db.prepare('SELECT * FROM topics WHERE board_id = ?');
    const results = stmt.all(id);
    console.log("TOPICS:", results);
    return c.json(results);  
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})
// TOPIC CREATE
route.post('/api/topic', authenticate, async(c)=>{
  try {
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
route.put('/api/topic/:id',async (c)=>{
  const { id } = c.req.param();
  try {
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
route.delete('/api/topic/:id', authenticate,(c)=>{
  try {
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
route.get('/api/topic/:id',(c)=>{
  // const db = c.get('db');
  // const id = c.req.param('id');
  // console.log("board ID: ", c.req.param());
  // const results = db.get_TopicID(id);
  // //console.log(results);
  // return c.json(results);
  return c.json({api:"ERROR"});
})

export default route;