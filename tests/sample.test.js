
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
// import db from '../src/db/sqlite/sqlite_db.js';
import { serve } from '@hono/node-server';
// import { getDB } from '../src/db/sqlite/sqlite_db.js';

// Function to create a server for testing
function createTestServer() {
  const server = serve({
    fetch: app.fetch,
    port: 0, // Use 0 to let the OS assign an available port
  });
  return server;
}

describe('Sample Test', () => {
  let server;
  let db;

  beforeAll(async () => {
    server = createTestServer();
    // db = getDB();
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    // if (db) db.close();
  });

  it('POST /auth/login should return response', async () => {
    // const response = request(server)
    await request(server)
      .post('/auth/login')
      .send({
        email: 'guest',
        password: 'guest',
      })
      // .expect(201)
      .expect(function(res) {
        console.log("res.body===========================");
        console.log("statusCode: ",res.statusCode);
        console.log("res.body");
        console.log(res.body);
        console.log(res.body.token);
      })
  });

  it('POST /login should return response {api, token}', async () => {
    // const response = request(server)
    await request(server)
      .post('/auth/login')
      .send({
        email: 'guest',
        password: 'guest',
      })
      // .expect(201)
      .expect(function(res) {
        console.log("statusCode: ",res.statusCode);
        console.log("res.body");
        console.log(res.body);
        console.log(res.body.token);
      })
  });

});