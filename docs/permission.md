
# Information:
  Work in progress.

  Note that there is middleware filter out the type with auth checks.
```js
//...
route.post('/api/forum', authenticate, authorize('forum', null, 'create'), async (c)=>{
//...
```
It required authenticate to work with authorize. This code allow who has permission to create forum else it would denied access.



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
- backup
- admin
- blog
- message
- 

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

# SQL:

```sql
INSERT INTO permissions (entity_type, entity_id, resource_type, action, allowed)
VALUES
  ('role', 'user', 'topic', 'create', 1), -- Users can create topics

  ('role', 'user', 'comment', 'delete', 1), -- Users can delete comments
  ('role', 'user', 'comment', 'create', 1), -- Users can create comments

  ('role', 'moderator', 'board', 'read', 1), -- Moderators can read board
  ('role', 'moderator', 'board', 'create', 1), -- Moderators can create board
  ('role', 'moderator', 'board', 'update', 1), -- Moderators can update board
  ('role', 'moderator', 'board', 'delete', 1), -- Moderators can delete board

  ('role', 'moderator', 'topic', 'read', 1), -- Moderators can read topic
  ('role', 'moderator', 'topic', 'create', 1), -- Moderators can create topic
  ('role', 'moderator', 'topic', 'update', 1), -- Moderators can update topic
  ('role', 'moderator', 'topic', 'delete', 1), -- Moderators can delete topic

  ('role', 'moderator', 'comment', 'read', 1), -- Moderators can read comment
  ('role', 'moderator', 'comment', 'create', 1), -- Moderators can create comment
  ('role', 'moderator', 'comment', 'update', 1), -- Moderators can update comment
  ('role', 'moderator', 'comment', 'delete', 1), -- Moderators can delete comment

  ('role', 'admin', 'forum', 'read', 1), -- Admins can read forum
  ('role', 'admin', 'forum', 'create', 1), -- Admins can create forum
  ('role', 'admin', 'forum', 'update', 1), -- Admins can update forum
  ('role', 'admin', 'forum', 'delete', 1), -- Admins can delete forum

  ('role', 'admin', 'board', 'read', 1), -- Admins can delete board
  ('role', 'admin', 'board', 'create', 1), -- Admins can delete board
  ('role', 'admin', 'board', 'update', 1), -- Admins can delete board
  ('role', 'admin', 'board', 'delete', 1), -- Admins can delete board

  ('role', 'admin', 'topic', 'read', 1), -- Admins can read topic
  ('role', 'admin', 'topic', 'create', 1), -- Admins can create topic
  ('role', 'admin', 'topic', 'update', 1), -- Admins can update topic
  ('role', 'admin', 'topic', 'delete', 1), -- Admins can delete topic

  ('role', 'admin', 'comment', 'read', 1), -- Admins can read comment
  ('role', 'admin', 'comment', 'create', 1), -- Admins can create comment
  ('role', 'admin', 'comment', 'update', 1), -- Admins can update comment
  ('role', 'admin', 'comment', 'delete', 1), -- Admins can delete comment

  ('group', '1', 'report', 'read', 1); -- Group with ID 1 can read reports
```