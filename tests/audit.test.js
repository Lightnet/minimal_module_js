import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
// import db from '../src/db/sqlite/sqlite_db.js';
import { serve } from '@hono/node-server';
import { getDB } from '../src/db/sqlite/sqlite_db.js';
import { generateTestToken } from './helpers.js';

// Function to create a server for testing
async function createTestServer() {
  const server = await serve({
    fetch: app.fetch,
    port: 0, // Use 0 to let the OS assign an available port
  });
  return server;
}

describe('Audit Logging', async () => {
  let server;
  let db;

  let adminToken = generateTestToken({ id: 1, role: 'admin' }); // Admin user (id: 1)

  beforeAll(async () => {
    server = await createTestServer();
    db = await getDB();
    // db.prepare('DELETE FROM audit_logs').run(); // Clear audit logs before each test
    // adminToken = generateTestToken({ id: 1, role: 'admin' }); // Admin user (id: 1)
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (db) db.close();
  });

  it('Logs create_group action', async () => {
    //working some degree test but need to clear out the data.
    // console.log("adminToken",adminToken);
    const response = await request(server)
      .post('/api/groups')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'test_group', description: 'Test group' })
      .expect(function(res) {
        // console.log('Raw JSON (res.text):', res.text)
      });
    expect(response.status, 201);

    const log = db.prepare('SELECT * FROM audit_logs WHERE action = ?').get('create_group');
    // console.log(log)
    expect(log).toBeDefined();
    expect(log.user_id).toBe(1);
    // expect(1 + 2).toBe(4)
    // expect(JSON.parse(log.details)).toMatchObject({ name: 'test_group' });
  });

  // it('Logs add_group_membership action', async () => {
  //   const response = await request(server)
  //     .post('/api/groups/membership')
  //     .set('Authorization', `Bearer ${adminToken}`)
  //     .send({ userId: 2, groupId: 1 });
  //   expect(response.status, 201);

  //   const log = db.prepare('SELECT * FROM audit_logs WHERE action = ?').get('add_group_membership');
  //   console.log("log ===================== ");
  //   console.log(log);
  //   // expect(log).toBeDefined();
  //   // expect(log.user_id, 1);
  //   // expect(JSON.parse(log.details)).toMatchObject({ user_id: 2, group_id: 1 });
  // });

  // it('Logs add_permission action', async () => {
  //   const response = await request(server)
  //     .post('/permissions')
  //     .set('Authorization', `Bearer ${adminToken}`)
  //     .send({
  //       entity_type: 'group',
  //       entity_id: '1',
  //       resource_type: 'topic',
  //       resource_id: 1,
  //       action: 'delete',
  //       allowed: true,
  //     });
  //   expect(response.status, 201);

  //   const log = db.prepare('SELECT * FROM audit_logs WHERE action = ?').get('add_permission');
  //   // expect(log).toBeDefined();
  //   // expect(log.user_id).toBe(1);
  //   // expect(JSON.parse(log.details)).toMatchObject({ entity_type: 'group', action: 'delete' });
  // });
});