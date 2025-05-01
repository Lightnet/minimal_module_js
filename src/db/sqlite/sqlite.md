```sql
CREATE INDEX idx_permissions_entity ON permissions (entity_type, entity_id);
CREATE INDEX idx_group_memberships_user ON group_memberships (user_id);
CREATE INDEX idx_topics_board ON topics (board_id, status);
```


```sql
CREATE TRIGGER cleanup_group_memberships
AFTER DELETE ON users
FOR EACH ROW
BEGIN
  DELETE FROM group_memberships WHERE user_id = OLD.id;
END;
```

```sql
CREATE TRIGGER cleanup_boards
AFTER DELETE ON forums
FOR EACH ROW
BEGIN
  DELETE FROM boards WHERE forum_id = OLD.id;
END;
```

```sql
CREATE INDEX idx_boards_forum ON boards (forum_id);
CREATE INDEX idx_forums_creator ON forums (creator_id);
```

```js
const request = require('supertest');
const app = require('./src/index');

test('Admin can create a forum', async () => {
  const token = 'admin_jwt_token';
  const response = await request(app)
    .post('/forums')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Forum', description: 'A test forum', moderator_group_id: 1 });
  expect(response.status).toBe(201);
  expect(response.body.name).toBe('Test Forum');
});
```

```env
DATABASE_PATH=./data/forum.db
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```