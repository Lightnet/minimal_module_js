// for utis database

import fs from 'fs/promises';
import { Hono } from 'hono';
import { getDB } from '../db/sqlite_db.js';
import van from "mini-van-plate/van-plate"
import { checkUserExists } from '../models/sqlite_user.js';
import { hashPassword } from '../../helpers.js';

const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';


const adminCache = new Map();
// Cache admin roles
async function cacheAdmins() {
  try {
    const db = await getDB();
    const admins = db.prepare('SELECT id, role FROM users WHERE role IN (?, ?)').all('admin', 'super_admin');
    console.log(admins);
    admins.forEach(({ id, role }) => adminCache.set(id, role));
  } catch (err) {
    console.error('Failed to cache admins:', err.message);
  }
}

// Check role from cache if DB is down
export async function getUserRoleWithFallback(userId) {
  try {
    const db = await getDB();
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    return user?.role;
  } catch (err) {
    console.error('Database unavailable, using cache:', err.message);
    return adminCache.get(userId); // Fallback to cache
  }
}

const fallbackAdmins = async () => {
  try {
    const data = await fs.readFile('fallback_admins.json', 'utf8');
    return JSON.parse(data); // { [userId]: role }
  } catch (err) {
    console.error('Failed to read fallback admins:', err.message);
    return {};
  }
};

// Get user role with fallback
export async function getUserRole(userId) {
  try {
    const db = await getDB();
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    return user?.role;
  } catch (err) {
    console.error('Database unavailable:', err.message);
    const cachedRole = adminCache.get(userId);
    if (cachedRole) return cachedRole;
    const fallback = await getFallbackAdmins();
    return fallback[userId];
  }
}

// Check role with file fallback
async function getUserRoleWithFileFallback(userId) {
  try {
    const db = await getDB();
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    return user?.role;
  } catch (err) {
    console.error('Database unavailable, using file fallback:', err.message);
    const admins = await fallbackAdmins();
    return admins[userId];
  }
}

// Function to save fallback admins to JSON file
async function saveFallbackAdmins() {
  try {
    const db = await getDB();
    // Query admins and super-admins from the database
    const admins = db.prepare('SELECT id, role FROM users WHERE role IN (?, ?)').all('admin', 'super_admin');

    // Format as { [userId]: role }
    const adminData = admins.reduce((acc, { id, role }) => {
      acc[id] = role;
      return acc;
    }, {});

    // Write to file
    await fs.writeFile('fallback_admins.json', JSON.stringify(adminData, null, 2), 'utf8');

    // Restrict file permissions (owner read/write only)
    await fs.chmod('fallback_admins.json', 0o600);

    console.log('fallback_admins.json saved successfully');
  } catch (err) {
    console.log('Failed to save fallback_admins.json:', err.message);
    console.error('Failed to save fallback_admins.json:', err.message);
  }
}
// await saveFallbackAdmins();
// Periodically refresh cache
// setInterval(cacheAdmins, 60 * 60 * 1000); // Every hour
// cacheAdmins(); // Initial cache

// Optional: Schedule updates (e.g., every hour)
// import { schedule } from 'node-cron';
// schedule('0 * * * *', saveFallbackAdmins); // Runs every hour

const route = new Hono({ 
  //strict: false 
});

//test for fail
route.get('/api/database/data', async (c) => {
  try {
    console.log('/api/database/data')
    const db = await getDB();
    const data = db.prepare('SELECT * FROM some_table').all();
    console.log(data)
    return c.json(data);
  } catch (err) {
    return c.json({ error: 'Service unavailable' }, 503);
  }
});

route.get('/api/database/status', async (c) => {
  const isDb = await checkDbHealth();
  return c.json({ maintenance: isMaintenanceMode, dbStatus: isDb ? 'up' : 'down' });
});

// app.get('/', (c) => {
//   if (isMaintenanceMode || !checkDbHealth()) {
//     return c.html('<h1>Under Maintenance</h1><p>Back soon!</p>');
//   }
//   return c.html('<h1>Welcome</h1>');
// });

route.get('/api/database/tables', async (c) => {

  try {

    const db = await getDB();
    const tables = db
      .prepare(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `)
      .all()
      .map(row => row.name);

      return c.json({ tables });

  } catch (error) {
    return c.json({error:"ERROR"});  
  }

});

const {a, body, div, form, button, label, input, li, p, ul} = van.tags
route.get('/setup', async (c) => {
  const db = await getDB();
  const adminExists = db
    .prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`)
    .get().count > 0;
  console.log(adminExists);
  // if(adminExists){
  //   return c.text('404 Not Found', 404);
  // }

  return c.html(
    van.html(
      body(
        p("Admin setup"),
        form({method:'POST',url:'/setup'},
          div(
            label('User Name:'),
            input({value:'admin',name:"username"})
          ),
          div(
            label('Passphrase:'),
            input({value:'admin',name:"passphrase"})
          ),
          div(
            label('Email:'),
            input({value:'admin',name:"email"})
          ),
          div(
          ),
          div(
            button({type:"submit"},'Register')
          )
        )
      )
    )
  )

})

route.post('/setup', async (c, next) => {
  const db = await getDB();
  const adminExists = db
    .prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`)
    .get().count > 0;
  console.log(adminExists);
  // if(adminExists){
  //   return c.text('404 Not Found', 404);
  // }

  let username = "";
  let passphrase = "";
  let email = "";
  
  try {
    let data = await c.req.parseBody();
    console.log("parseBody:",data)
    if(data){
      username = data.username
      passphrase = data.passphrase
      email = data.email
    }  
  } catch (error) {
    
  }

  if(username && passphrase){
    console.log("FOUND");
    console.log("username:",username)
    console.log("passphrase:",passphrase)
    console.log("email:",email)

    const user = await checkUserExists({
      username: username, 
      email: email
    });

    if(!user){
      // const result = signup(username, email , passphrase);
      let {salt, hash} = hashPassword(passphrase);
      const role = "admin"

      const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash, role, salt)
        VALUES (?, ?, ?, ?, ?)
      `);

      const result = stmt.run(username, email, hash, role, salt);
      console.log(result)

      username = null;
      passphrase = null;
      email = null;
      return c.text('CREATE', 200);
    }
  }

  return c.text('404 Not Found', 404);
})


export default route;

// Database health check
export async function checkDbHealth() {
  try {
    const db = await getDB();
    db.prepare('SELECT 1').run();
    return true;
  } catch (err) {
    return false;
  }
}

// Apply maintenance middleware to specific route groups
// app.use('/api/data/*', maintenanceMiddleware); // Protect /api/data/*
// app.use('/public/*', maintenanceMiddleware); // Protect /public/*

// Apply maintenance middleware to specific groups
// api.use('*', maintenanceMiddleware);
// publicRoutes.use('*', maintenanceMiddleware);

