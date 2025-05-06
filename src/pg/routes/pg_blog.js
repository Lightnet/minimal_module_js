/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getPool } from '../db/pg_pool.js';

const route = new Hono();

// GET BLOGS
route.get('/api/blog', async (c) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM blogs');
    const blogs = result.rows;
    return c.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err.stack);
    return c.json({ api: 'error' }, 500);
  }
});

// CREATE
route.post('/api/blog', async (c) => {
  try {
    const { title, content } = await c.req.json();
    console.log('data:', { title, content });

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );

    return c.json({ api: 'CREATE', blog: result.rows[0] }, 201);
  } catch (err) {
    console.error('Error creating blog:', err.message);
    return c.json({ api: 'error', error: err.message }, 400);
  }
});

// UPDATE
route.put('/api/blog/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { title, content } = await c.req.json();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const pool = getPool();
    const result = await pool.query(
      'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    if (!result.rows.length) {
      return c.json({ api: 'error', error: 'Blog not found' }, 404);
    }

    return c.json({ api: 'UPDATE', blog: result.rows[0] });
  } catch (err) {
    console.error('Error updating blog:', err.stack);
    return c.json({ api: 'error', error: err.message }, 400);
  }
});

// DELETE
route.delete('/api/blog/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const pool = getPool();
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return c.json({ api: 'error', error: 'Blog not found' }, 404);
    }

    return c.json({ api: 'DELETE' });
  } catch (err) {
    console.error('Error deleting blog:', err.stack);
    return c.json({ api: 'ERROR', error: err.message }, 400);
  }
});

export default route;