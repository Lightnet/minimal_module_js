/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../../db/pg_pool.js';
import { authenticate, authorize } from '../../middleware/pg_auth.js';

const route = new Hono({ 
  // strict: false 
});


export default route;