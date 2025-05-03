
import { Hono } from 'hono';
import { authenticate, authorize } from '../middleware/sqlite/sqlite_auth.js';
import { addPermission } from '../models/sqlite/sqlite_user.js';
import db from '../db/sqlite/sqlite_db.js';
// import db from '../db/sqlite/sqlite_db.js';
// const { rateLimiter } = require('@hono/rate-limiter');
// permissions.use('/permissions', rateLimiter({ windowMs: 15 * 60 * 1000, limit: 100 }));

const permissions = new Hono();

// List all permissions (admin-only)
permissions.get('permissions', authenticate, authorize('group', null, 'manage'), async (c) => {
  const stmt = db.prepare(`
    SELECT id, entity_type, entity_id, resource_type, resource_id, action, allowed
    FROM permissions
  `);
  const permissions = stmt.all();
  console.log(permissions)
  return c.json(permissions);
});

// Add or update a permission
permissions.post('permissions', authenticate, authorize('group', null, 'manage'), async (c) => {
  const { entity_type, entity_id, resource_type, resource_id, action, allowed } = await c.req.json();
  console.log("entity_type: ", entity_type);
  console.log("entity_id: ", entity_id);
  console.log("resource_type: ", resource_type);
  console.log("resource_id: ", resource_id);
  console.log("action: ", action);
  console.log("allowed: ", allowed);

  try {
    const permission = addPermission({
      entity_type,
      entity_id,
      resource_type,
      resource_id: resource_id ? parseInt(resource_id, 10) : null,
      action,
      allowed: allowed === true || allowed === 'true',
    });
    return c.json(permission, 201);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

// Serve permission management HTML
// permissions.get('/manage', authenticate, async (c) => {
//   const user = c.get('user');
//   if (!user || user.role !== 'admin') {
//     return c.redirect('/auth/login');
//   }
//   const html = fs.readFileSync(path.join(__dirname, '../public/permissions.html'), 'utf8');
//   return c.html(html);
// });

// module.exports = permissions;
export default permissions;

/*
GET /permissions: Returns all permissions as JSON for the list table.

POST /permissions: Unchanged, but ensures resource_id is parsed as an integer and allowed handles boolean-like inputs.

GET /permissions/manage: Serves the permissions.html file (created below) for the admin interface.

Authentication: All endpoints require authenticate and authorize('group', null, 'manage') to restrict to admins.
*/