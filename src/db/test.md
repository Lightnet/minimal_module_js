```js
const request = require('supertest');
const app = require('./src/index');

test('Moderator can delete topic in their board', async () => {
  const token = 'moderator_jwt_token'; // From login
  const response = await request(app)
    .delete('/topics/1')
    .set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(200);
});
```