/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { scriptHtml02 } from '../../pages.js';
import { getDB } from '../../../db/sqlite/sqlite_db.js';
import { authenticate, authorize } from '../../../middleware/sqlite/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});

route.get('/report', async (c)=>{
  
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM reports`);
    const results = stmt.all();

    return c.json(results);
  } catch (error) {
    return c.json({api:'ERROR'});
  }
  // if(results){
  //   return c.json(results);
  // }else{
  //   return c.json(JSON.stringify({api:'ERROR'}));
  // }
});

route.post('/report', authenticate, async (c)=>{
  const {title, type, content} = await c.req.json();
  const data = await c.req.json();
  console.log("data: ", data);

  try {
    const user = c.get('user');
    const db = await getDB();
    const stmt = db.prepare('INSERT INTO reports (user_id, type, title, content) VALUES (?, ?, ?, ?)');
    const results = stmt.run(user.id, type, title, content);
    console.log(results);
    return c.json({api:"CREATED"});
  } catch (error) {
    console.log(error.message);
    return c.json({api:"ERROR"});
  }
  return c.json({api:"ERROR"});
});

export default route;