/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from './pages.js';

const route = new Hono();

//===============================================
// COMMENT
//===============================================
route.post('/api/comment', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);
  const results = db.create_comment(data.parentid,data.title,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// COMMENT UPDATE
route.put('/api/comment/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.comment_update(id, data.title,data.content);
    return c.json(result);
  }
  return c.json({api:'ERROR'});
})
// COMMENT DELETE
route.delete('/api/comment/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.comment_delete(id);
  console.log("result: ",result)
  //console.log(db);
  return c.json(result);
})

export default route;