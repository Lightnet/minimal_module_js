-- Role-based permissions
INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed) VALUES
  -- User role
  ('role', 'user', 'board', NULL, 'read', TRUE),
  ('role', 'user', 'topic', NULL, 'create', TRUE),
  ('role', 'user', 'topic', NULL, 'read', TRUE),
  ('role', 'user', 'comment', NULL, 'create', TRUE),
  ('role', 'user', 'comment', NULL, 'read', TRUE),
  -- Moderator role
  ('role', 'moderator', 'topic', NULL, 'update', TRUE),
  ('role', 'moderator', 'topic', NULL, 'delete', TRUE),
  ('role', 'moderator', 'comment', NULL, 'update', TRUE),
  ('role', 'moderator', 'comment', NULL, 'delete', TRUE),
  -- Admin role
  ('role', 'admin', 'board', NULL, 'create', TRUE),
  ('role', 'admin', 'board', NULL, 'update', TRUE),
  ('role', 'admin', 'board', NULL, 'delete', TRUE),
  ('role', 'admin', 'user', NULL, 'manage', TRUE);

-- Example group-based permissions
INSERT INTO groups (name, description) VALUES
  ('board1_moderators', 'Moderators for Board 1'),
  ('trusted_users', 'Users with extra privileges');

INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed) VALUES
  -- Board 1 moderators can manage topics and comments in Board 1
  ('group', '1', 'topic', 1, 'update', TRUE),
  ('group', '1', 'topic', 1, 'delete', TRUE),
  ('group', '1', 'comment', 1, 'update', TRUE),
  ('group', '1', 'comment', 1, 'delete', TRUE),
  -- Trusted users can create topics in any board
  ('group', '2', 'topic', NULL, 'create', TRUE);