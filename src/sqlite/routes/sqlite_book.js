/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { getDB } from '../db/sqlite_db.js';
import { authenticate } from '../middleware/sqlite_auth.js';
import { scriptHtml02 } from '../../routes/pages.js';

const route = new Hono();

//page
route.get('/books', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});
route.get('/book/*', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});
//get books
route.get('/api/books', authenticate, async (c) => {
  try {
    const db = await getDB();
    let stmt = db.prepare(`SELECT * FROM books`);
    const results = stmt.all();
    return c.json(results);

  } catch (error) {
    return c.json({api:"error"});
  }
});

// Create a book
route.post('/api/books', authenticate, async (c) => {
  const db = await getDB();
  const { title, description } = await c.req.json();

  const user = c.get('user');
  console.log("user: ", user);
  const user_id = user.id;
  if (!title || !description) return c.json({ error: 'Missing title or user_id' }, 400);

  const stmt = db.prepare('INSERT INTO books (title, description, user_id) VALUES (?, ?, ?)');
  const result = stmt.run(title, description, user_id);
  
  return c.json({ id: result.lastInsertRowid, title, user_id }, 201);
});

// Create a page
route.post('/api/books/:book_id/pages', authenticate, async (c) => {
  const db = await getDB();
  const { book_id } = c.req.param();
  const { content } = await c.req.json();
  if (!content) return c.json({ error: 'Missing content' }, 400);

  // Get the highest page number for this book
  const lastPage = db
    .prepare('SELECT MAX(page_number) as max FROM pages WHERE book_id = ?')
    .get(book_id);
  const page_number = (lastPage.max || 0) + 1;

  const stmt = db.prepare(
    'INSERT INTO pages (book_id, page_number, content) VALUES (?, ?, ?)'
  );
  const result = stmt.run(book_id, page_number, content);
  return c.json({ id: result.lastInsertRowid, book_id, page_number, content }, 201);
});

// Get a specific page
route.get('/api/books/:book_id/pages/:page_number', authenticate, async (c) => {
  const { book_id, page_number } = c.req.param();
  const db = await getDB();
  const page = db
    .prepare('SELECT * FROM pages WHERE book_id = ? AND page_number = ?')
    .get(book_id, page_number);

  if (!page) return c.json({ error: 'Page not found' }, 404);

  // Get next and previous page numbers
  const nextPage = db
    .prepare(
      'SELECT page_number FROM pages WHERE book_id = ? AND page_number > ? LIMIT 1'
    )
    .get(book_id, page_number);
  const prevPage = db
    .prepare(
      'SELECT page_number FROM pages WHERE book_id = ? AND page_number < ? ORDER BY page_number DESC LIMIT 1'
    )
    .get(book_id, page_number);

  return c.json({
    ...page,
    next_page: nextPage ? nextPage.page_number : null,
    prev_page: prevPage ? prevPage.page_number : null,
  });
});
// get bookid with page count
route.get('/api/books/:book_id/pages', authenticate, async (c) => {
  const { book_id } = c.req.param();
  try {
    const db = await getDB();
    const book = db
    .prepare(
      `SELECT COUNT(*) AS total_pages 
      FROM pages 
      WHERE book_id = ?;`
    )
    .get(book_id);
    return c.json({
      pages:book.total_pages
    });
  } catch (error) {
    console.log()
    return c.json({error:`book ${book_id} page null`})
  }
});
//get bookid with contents
route.get('/api/books/:book_id/contents', authenticate, async (c) => {
  const { book_id } = c.req.param();
  try {
    const db = await getDB();
    const contents = db
    .prepare(
      `SELECT *
      FROM pages 
      WHERE book_id = ?;`
    )
    .all(book_id);
    return c.json({
      contents
    });
  } catch (error) {
    console.log()
    return c.json({error:`book ${book_id} page null`})
  }
});

route.delete('/api/book/page/:page_id', authenticate, async (c) => {
  const { page_id } = c.req.param();
  try {
    const db = await getDB();
    const result = db
    .prepare(
      `DELETE
      FROM pages 
      WHERE id = ?;`
    )
    .run(page_id);
    return c.json(
      result
    );
  } catch (error) {
    console.log(error.message)
    return c.json({error:`page id ${page_id} is null`})
  }
});

route.put('/api/book/page/:page_id', authenticate, async (c) => {
  const { page_id } = c.req.param();
  const { content } = await c.req.json();
  console.log("content: ", content);
  try {
    const db = await getDB();
    const result = db
    .prepare(
      `UPDATE pages
      SET content=? 
      WHERE id = ?;`
    )
    .run(content, page_id);
    return c.json(
      result
    );
  } catch (error) {
    console.log(error.message)
    return c.json({error:`page id ${page_id} is null`})
  }
});


export default route;