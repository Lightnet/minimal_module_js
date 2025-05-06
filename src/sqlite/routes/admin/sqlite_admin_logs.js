/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getDB } from '../../db/sqlite_db.js';
import { authenticate, authorize } from '../../middleware/sqlite_auth.js';

const route = new Hono({ 
  //strict: false 
});

route.get('/api/admin/logs', authenticate, authorize('audit_logs', null, 'manage'), async (c) => {    
  try {
    const db = await getDB();
    const stmt = db.prepare('SELECT * FROM audit_logs');
    const groups = stmt.all();
    // console.log("groups: ", groups);
    return c.json(groups);
  } catch (error) {
    return c.json({error:"error logs"})
  }

  // return c.html(pageHtml);
});

export default route;