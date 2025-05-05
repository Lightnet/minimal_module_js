/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getDB } from '../db/sqlite/sqlite_db.js';

const route = new Hono();
// GET MESSAGES
route.get('/api/message', async (c)=>{
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM messages`);
    const results = stmt.all();
    return c.json(results);
  } catch (error) {
    return c.json({api:"error"});
  }
})

// CREATE
route.post('/api/message', async(c)=>{
  try {
    // const data = await c.req.json();
    const {alias, subject, content} = await c.req.json();
    // console.log("data: ", data);
    const db = await getDB();
    const stmt = db.prepare('INSERT INTO messages (to_username, subject, content) VALUES (?, ?, ?)');
    stmt.run(alias, subject, content);
    return c.json({api:"CREATED"});
  } catch (error) {
    console.log("error: ", error.message);
    return c.json({api:"ERROR"});
  }
})

//DELETE
route.delete('/api/message/:id', async(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = await getDB();
  const stmt = db.prepare('DELETE FROM messages WHERE id=?')
  const result = stmt.run(id);
  console.log("result: ",result)
  //console.log(db);

  return c.json(result);
})

export default route;