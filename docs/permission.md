
# Information:
  Work in progress.

  Note that there is middleware filter out the type with auth checks.
```js
//...
route.post('/api/forum', authenticate, authorize('forum', null, 'create'), async (c)=>{
//...
```
It required authenticate to work with authorize. This code allow who has permission to create forum.



# entity type:
 * role
 * group
# entity id:
- user
- moderator
- admin
- user id
# resource_type:
- topic
- comment
- board
- forum
- report
- permissions
- group_memberships
- audit_logs

# resource_id:
- board id
- forum id
- board id

filter by id.

# action:
- create
- update
- delete
- read
- manage (view html)

# tech_moderators
```sql
INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
VALUES ('group', '1', 'topic', 1, 'update', 1),
       ('group', '1', 'topic', 1, 'delete', 1);
```
# moderator 
```sql
INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
VALUES ('role', 'moderator', 'forum', null, 'create', 1);
```

```sql
INSERT INTO permissions (entity_type, entity_id, resource_type, action, allowed)
VALUES
  ('role', 'user', 'topic', 'create', 1), -- Users can create topics
  ('role', 'user', 'comment', 'delete', 1), -- Users can delete comments
  ('role', 'moderator', 'board', 'update', 1), -- Moderators can update boards
  ('role', 'admin', 'forum', 'delete', 1), -- Admins can delete forums
  ('group', '1', 'report', 'read', 1); -- Group with ID 1 can read reports
```