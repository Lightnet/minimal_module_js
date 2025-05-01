/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { scriptHtml02 } from './pages.js';
import db from '../db/sqlite/sqlite_db.js';
import { getForumById, createForum } from '../models/sqlite/sqlite_user.js';
import { authenticate, authenticateToken, authorize } from '../middleware/sqlite/sqlite_auth.js';

const route = new Hono();

route.get('/forum', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

route.get('/forum/*', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

route.get('/board/*', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

route.get('/topic/*', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

route.get('/comment/*', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

//===============================================
// FORUM
//===============================================
// FORUM GET
route.get('/api/forum',(c)=>{
  const stmt = db.prepare('SELECT * FROM forums');
  const forums = stmt.all();
  return c.json(forums);
  // return c.json({});
});

route.get('/api/forum/:id',(c)=>{
  const { id } = c.req.param();
  const forum = getForumById(id);
  if (!forum) {
    return c.json({ error: 'Forum not found' }, 404);
  }
  return c.json(forum);
});

// FORUM CREATE
route.post('/api/forum', authenticateToken, authorize('forum', null, 'create'), async(c)=>{
// route.post('/api/forum', authenticateToken, authorize({resourceType:'forum', resourceId: null, action:'create'}), async(c)=>{
// route.post('/api/forum', authenticateToken, async(c)=>{
  const { name, description, moderator_group_id } = await c.req.json();
  console.log("name:", name);
  console.log("description:", description);
  console.log("moderator_group_id:", moderator_group_id);
  const user = c.get('user');
  console.log("user]]>:", user);
  try {
    const forum = createForum(name, description, user.id, moderator_group_id);
    console.log("forum: ", forum);
    // return c.json(forum, 201);
    return c.json({
      api:'CREATE',
      name:name,
      description:description,
    });
  } catch (error) {


    return c.json({ error: error.message }, 400);
  }
  return c.json({ error: "error" }, 400);
})
// FORUM UPDATE
route.put('/api/forum/:id' ,async (c)=>{
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  const authResult = await authorize('forum', forumId, 'update')(c.req, c);
  if (authResult) return authResult;

  const { name, description, moderator_group_id } = await c.req.json();
  const stmt = db.prepare(`
    UPDATE forums
    SET name = ?, description = ?, moderator_group_id = ?
    WHERE id = ?
  `);
  stmt.run(name, description, moderator_group_id, id);
  const updatedForum = getForumById(id);
  return c.json(updatedForum);
})
// FORUM DELETE
route.delete('/api/forum/:id', async (c)=>{
  const { id } = c.req.param();
  const forumId = parseInt(id, 10);
  const authResult = await authorize('forum', forumId, 'delete')(c.req, c);
  if (authResult) return authResult;

  const stmt = db.prepare('DELETE FROM forums WHERE id = ?');
  stmt.run(id);
  return c.json({ message: 'Forum deleted' });
})


//===============================================
// EXPORT
//===============================================
export default route;