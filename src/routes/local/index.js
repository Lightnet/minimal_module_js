/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// for local db for access.
// monitor admins if someone try to change role to admin access will auto go lock out?
// 

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';

const __dirname = dirname(fileURLToPath(import.meta.url));

const route = new Hono();

route.get("/p/admin", (c, next) => {
  return c.text('Test');
});

export default route;