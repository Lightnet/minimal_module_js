/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
// import { scriptHtml02 } from '../pages.js';
// import db from '../../db/sqlite/sqlite_db.js';
import { getDB } from '../db/sqlite_db.js';
import { authenticate, authorize } from '../middleware/sqlite_auth.js';

const route = new Hono();

//===============================================
// COMMENT
//===============================================

// get comments from topic id parent
route.get('/api/comments/:id', authenticate, authorize('comment', null, 'read'),async (c)=>{
  try {
    const db = await getDB();
    const id = c.req.param('id');
    console.log("TOPICS: ", id);
    const stmt = db.prepare('SELECT * FROM comments WHERE topic_id = ?');
    const results = stmt.all(id);
    console.log("COMMENTS:", results);
    return c.json(results);  
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})
// CREATE COMMENT
route.post('/api/comment', authenticate, authorize('comment', null, 'create'), async(c)=>{
  try {
    const db = await getDB();
    const { content, parentid } = await c.req.json();
    console.log("content:", content);
    console.log("parentid:", parentid);
    const user = c.get('user');
    console.log("user:",user);
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`INSERT INTO comments (topic_id, user_id, content)
      VALUES (?, ?, ?)`);
    const result = stmt.run(parentid, user.id, content);
    return c.json({api:"CREATE"});
  } catch (error) {
    console.log("TOPIC CREATE ERROR",error.message);
    return c.json({api:"ERROR"});
  }
})
// COMMENT UPDATE
route.put('/api/comment/:id', authenticate, authorize('comment', null, 'update'), async (c)=>{
  const { id } = c.req.param();
  try {
    const db = await getDB();
    console.log("COMMENT UPDATE?");
    const { content } = await c.req.json();
    console.log("ID: ", id);
    console.log("Comment: ", content);
    const user = c.get('user');
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`UPDATE comments SET content=? WHERE id=?`);
    const result = stmt.run(content, id);
    console.log("result: ", result);

    return c.json({api:"UPDATE"});
  } catch (error) {
    console.log(error);
    return c.json({api:"ERROR"});
  }
})
// COMMENT DELETE
route.delete('/api/comment/:id', authenticate, authorize('comment', null, 'delete'), async (c)=>{
  try {
    const db = await getDB();
    const { id } = c.req.param();
    const commentId = parseInt(id, 10);
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(commentId);
    console.log("DELETE...");
    return c.json({api:'DELETE'});
  } catch (error) {
    return c.json({api:'ERROR'});
  }
})

export default route;