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

import cron  from 'node-cron';

// cron.schedule('0 0 * * *', () => {
//   console.log('Running nightly maintenance');
// });

var task = cron.schedule('* * * * *', () => {
  console.log('Running nightly maintenance');
},{
  scheduled: false
});


const route = new Hono({ 
  //strict: false 
});

route.get('/api/admin/backup/start', async (c)=>{
  if(task){
    console.log("start timer");
    task.start();
  }
  return c.json({api:"start"});
})

route.get('/api/admin/backup/stop', async (c)=>{
  if(task){
    console.log("stop timer");
    task.stop();
  }
  return c.json({api:"stop"});
})

export default route;