```
CREATE INDEX idx_permissions_entity ON permissions (entity_type, entity_id);
CREATE INDEX idx_group_memberships_user ON group_memberships (user_id);
```