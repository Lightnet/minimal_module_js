/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import fs from 'fs/promises';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { checkDbHealth, getUserRole } from '../routes/sqlite_database.js';
import { verify } from 'hono/jwt';

// Initialize maintenance state
export async function initMaintenanceState() {
  try {
    await fs.access('maintenance.json');
  } catch {
    // Create file if it doesn't exist
    await fs.writeFile('maintenance.json', JSON.stringify({ isMaintenanceMode: false }), 'utf8');
    await fs.chmod('maintenance.json', 0o600);
  }
}

// Read maintenance state
export async function getMaintenanceState() {
  try {
    const data = await fs.readFile('maintenance.json', 'utf8');
    return JSON.parse(data).isMaintenanceMode;
  } catch (err) {
    console.error('Failed to read maintenance.json:', err.message);
    return false; // Default to false if file is missing
  }
}

// Update maintenance state
export async function setMaintenanceState(isEnabled) {
  try {
    await fs.writeFile('maintenance.json', JSON.stringify({ isMaintenanceMode: isEnabled }), 'utf8');
    await fs.chmod('maintenance.json', 0o600);
    console.log(`Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}`);
  } catch (err) {
    console.error('Failed to update maintenance.json:', err.message);
    throw new Error('Failed to update maintenance state');
  }
}

/*
// maintenance.json
{
  "isMaintenanceMode": false
}
*/
export async function maintenanceMiddleware(c, next){
  const isMaintenanceMode = await getMaintenanceState();
  const isDbHealthMode = await checkDbHealth();
  if (!isMaintenanceMode && isDbHealthMode) {
    await next(); // Proceed if not in maintenance mode and DB is up
    return;
  }

  const authHeader = c.req.header('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to cookie
    const tokenCookie = getCookie(c, 'token');
    // const tokenCookie = getCookie(c, 'auth_token');
    // console.log("tokenCookie: ", tokenCookie);
    if (tokenCookie) {
      token = tokenCookie;
    }
  }

  // If no token found, return 401
  if (!token) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  try {
    const decoded = await verify(token, process.env.JWT_SECRET || 'SECRET');
    // console.log("decoded: ", decoded);

    const role = await getUserRole(decoded.id);
    // console.log("role:", role);
    if (['admin', 'super_admin'].includes(role)) {
      await next(); // Allow admins/super-admins
      return;
    }
    return c.json({ error: 'Service under maintenance' }, 503);
  } catch (error) {
    console.log("ERROR:", error.message);
    return c.json({ error: 'Service under maintenance' }, 503);
  }
}

const route = new Hono({ 
  //strict: false 
});

route.post('/api/maintenance', async (c)=>{
  const { enable } = await c.req.json(); // Expect { enable: true/false }
  if (typeof enable !== 'boolean') {
    return c.json({ error: 'Invalid request: enable must be a boolean' }, 400);
  }
  try {
    await setMaintenanceState(enable);
    return c.json({ message: `Maintenance mode has been enabled ${enable ? 'enabled' : 'disabled'}` });
  } catch (error) {
    return c.json({ error: 'Failed to update maintenance mode' }, 500);
  }
});

export default route;

// Maintenance Middleware
// const maintenanceMiddleware = async (c, next) => {
//   const isMaintenanceMode = await getMaintenanceState();
//   if (!isMaintenanceMode && checkDbHealth()) {
//     await next(); // Proceed if not in maintenance mode and DB is up
//     return;
//   }
//   const payload = c.get('jwtPayload');
//   if (!payload) {
//     return c.json({ error: 'Unauthorized' }, 401);
//   }
//   const role = await getUserRole(payload.userId);
//   if (['admin', 'super_admin'].includes(role)) {
//     await next(); // Allow admins/super-admins
//     return;
//   }
//   return c.json({ error: 'Service under maintenance' }, 503);
// };

// Middleware
// app.use('*', async (c, next) => {
//   const isMaintenanceMode = await getMaintenanceState();
//   if (!isMaintenanceMode && checkDbHealth()) {
//     return await next(); // Proceed if not in maintenance mode and DB is up
//   }
//   const payload = c.get('jwtPayload');
//   if (!payload) {
//     return c.json({ error: 'Unauthorized' }, 401);
//   }
//   const role = await getUserRole(payload.userId);
//   if (['admin', 'super_admin'].includes(role)) {
//     return await next(); // Allow admins/super-admins
//   }
//   return c.json({ error: 'Service under maintenance' }, 503);
// });

// app.post('/api/maintenance', async (c) => {
//   const payload = c.get('jwtPayload');
//   if (!payload) {
//     return c.json({ error: 'Unauthorized' }, 401);
//   }
//   const role = await getUserRole(payload.userId);
//   if (!['admin', 'super_admin'].includes(role)) {
//     return c.json({ error: 'Forbidden: Admin access required' }, 403);
//   }
//   const { enable } = await c.req.json(); // Expect { enable: true/false }
//   if (typeof enable !== 'boolean') {
//     return c.json({ error: 'Invalid request: enable must be a boolean' }, 400);
//   }
//   try {
//     await setMaintenanceState(enable);
//     return c.json({ message: `Maintenance mode has been enabled ${enable ? 'enabled' : 'disabled' });
//   } catch (err) {
//     return c.json({ error: 'Failed to update maintenance mode' }, 500);
//   }
// });

