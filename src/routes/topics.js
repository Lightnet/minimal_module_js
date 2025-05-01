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
// TOPIC
//===============================================
// TOPIC CREATE
route.post('/api/topic', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);
  const results = db.create_topic(data.parentid,data.title,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// TOPIC UPDATE
route.put('/api/topic/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.topic_update(id, data.title,data.content);
    return c.json(result);
  }
  return c.json({api:'ERROR'});
})
// TOPIC DELETE
route.delete('/api/topic/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.topic_delete(id);
  console.log("result: ",result)
  //console.log(db);
  return c.json(result);
})
//get comments?
route.get('/api/topic/:id',(c)=>{
  const db = c.get('db');
  const id = c.req.param('id');
  console.log("board ID: ", c.req.param());
  const results = db.get_TopicID(id);
  //console.log(results);
  return c.json(results);
})

export default route;