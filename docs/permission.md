
# Information:
  Work in progress.

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