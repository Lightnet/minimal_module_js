/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
// import { scriptHtml02 } from '../pages.js';
import { getDB } from '../../db/sqlite/sqlite_db.js';
import { authenticate } from '../../middleware/sqlite/sqlite_auth.js';

const route = new Hono();

// BOARD GET test
// route.get('/api/board',(c)=>{
//   const db = c.get('db');
//   const results = db.get_boards();
//   return c.json(results);
// })

// https://hono.dev/docs/api/routing
// BOARD GET
route.get('/api/boards/:id', async (c)=>{
  
  try {
    const db = await getDB();
    const id = c.req.param('id');
    console.log("BOARDS: ", id);
    const stmt = db.prepare('SELECT * FROM boards WHERE forum_id = ?');
    const results = stmt.all(id);
    console.log("BOARDS:", results);
    return c.json(results);
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})

// Boards get parent id
route.get('/api/board/:id', async (c)=>{
  try {
    const { id } = c.req.param();
    const db = await getDB();
    const stmt = db.prepare('SELECT * FROM boards WHERE id = ?');
    const results = stmt.get(id);
    return c.json(results);
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})

// BOARD CREATE
route.post('/api/board', authenticate, async(c)=>{
  try {
    const db = await getDB();
    const { name, description, moderator_group_id, parentid } = await c.req.json();
    // console.log("name:", name);
    // console.log("description:", description);
    // console.log("moderator_group_id:", moderator_group_id);
    // console.log("parentid:", parentid);
    const user = c.get('user');
    // console.log("user:",user);
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`INSERT INTO boards (forum_id, name, description, creator_id, moderator_group_id)
      VALUES (?, ?, ?, ?, ?)`);
    const result = stmt.run(parentid, name, description, user.id, moderator_group_id);
    // console.log("BOARD CREATE", result);
    // const data = db.prepare('SELECT * FROM boards WHERE id = ?').get(result.lastInsertRowid);
    // console.log(data);
    return c.json({api:"CREATE"});
  } catch (error) {
    console.log("BOARD CREATE ERROR",error.message);
    return c.json({api:"ERROR"});
  }
})
// BOARD UPDATE
route.put('/api/board/:id', async (c)=>{
  const { id } = c.req.param();
  try {
    const db = await getDB();
    console.log("BOARD UPDATE?");
    const { name, description } = await c.req.json();
    console.log("ID: ", id);
    console.log("name: ", name);
    console.log("description: ", description);
    const user = c.get('user');
    db.pragma('foreign_keys = 0');
    const stmt = db.prepare(`UPDATE boards SET name=?, description=? WHERE id=?`);
    const result = stmt.run(name, description, id);
    console.log("result: ", result);

    return c.json({api:"UPDATE"});
  } catch (error) {
    return c.json({api:"ERROR"});
  }
})
// BOARD DELETE
route.delete('/api/board/:id', authenticate, async (c)=>{
  try {
    const db = await getDB();
    const { id } = c.req.param();
    const boardId = parseInt(id, 10);

    const stmt = db.prepare('DELETE FROM boards WHERE id = ?');
    stmt.run(boardId);
    console.log("DELETE...");
    return c.json({api:'DELETE'});
  } catch (error) {
    return c.json({api:'ERROR'});
  }
})

export default route;