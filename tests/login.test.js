
// import {expect, describe, jest, test} from '@jest/globals';
// import g from '@jest/globals';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
// import db from '../src/db/sqlite/sqlite_db.js';
import { serve } from '@hono/node-server';
import { getDB } from '../src/db/sqlite/sqlite_db.js';

// console.log(g);

// Function to create a server for testing
function createTestServer() {
  const server = serve({
    fetch: app.fetch,
    port: 0, // Use 0 to let the OS assign an available port
  });
  return server;
}

describe('Login Test Access', () => {
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

  // it('POST /login should return response', async () => {
  //   const response = await request(server)
  //     .post('/login') // Corrected endpoint
  //     .send({
  //       email: 'guest',
  //       password: 'guest1',
  //     })
  //     .expect(function(res) {
  //       console.log("res.body===========================");
  //       console.log("res.body");
  //       console.log(res.body);
  //       console.log("res.text");
  //       console.log('Raw JSON (res.text):', res.text);
  //     })
  //     // .expect(200); // Adjust status code as needed (201 if expecting creation)

  //   // Log raw JSON string (unparsed)
  //   console.log('Raw JSON (res.text):', response.text);

  //   // Log parsed JSON object
  //   console.log('Parsed JSON (res.body):', response.body);
  //   console.log('res.body.name:', response.body.name);
  //   console.log('res.body.token:', response.body.token);

  //   // Example assertions for parsed JSON
  //   // expect(response.body).toBeInstanceOf(Object); // Ensure it's an object
  //   // expect(response.body).toHaveProperty('token'); // Check for token property
  //   // expect(response.body.name).toBe('someName'); // Uncomment and adjust as needed
  // });

  it('POST /api/auth/login should return response', async () => {
    const response = await request(server)
      .post('/auth/login') // Corrected endpoint
      .send({
        email: 'guest',
        password: 'guest1',
      })
      .expect(function(res) {
        console.log("res.body===========================");
        console.log("res.body");
        console.log(res.body);
        console.log("res.text");
        console.log('Raw JSON (res.text):', res.text);
      })
      // .expect(200); // Adjust status code as needed (201 if expecting creation)

    // Log raw JSON string (unparsed)
    console.log('Raw JSON (res.text):', response.text);

    // Log parsed JSON object
    console.log('Parsed JSON (res.body):', response.body);
    console.log('res.body.name:', response.body.name);
    console.log('res.body.token:', response.body.token);

    // Example assertions for parsed JSON
    // expect(response.body).toBeInstanceOf(Object); // Ensure it's an object
    // expect(response.body).toHaveProperty('token'); // Check for token property
    // expect(response.body.name).toBe('someName'); // Uncomment and adjust as needed
  });
});