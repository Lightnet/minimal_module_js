/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from './pages.js';

const route = new Hono();

// BOARD GET test
route.get('/api/board',(c)=>{
  const db = c.get('db');
  const results = db.get_boards();
  return c.json(results);
})

// https://hono.dev/docs/api/routing
// BOARD GET
route.get('/api/board/:id',(c)=>{
  const db = c.get('db');
  const id = c.req.param('id');
  console.log("board ID: ", c.req.param());
  const results = db.get_boardID(id);
  return c.json(results);
})

// BOARD CREATE
route.post('/api/board', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  const results = db.board_create(data.parentid,data.title,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// BOARD UPDATE
route.put('/api/board/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.board_update(id, data.title,data.content);
    return c.json(result);
  }
  return c.json({api:'ERROR'});
})
// BOARD DELETE
route.delete('/api/board/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.board_delete(id);
  console.log("result: ",result)
  //console.log(db);
  return c.json(result);
})

export default route;