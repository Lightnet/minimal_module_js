-- Users table (unchanged except for role default)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- Roles: user, moderator, admin
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- Status: active, muted, banned
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table for user groupings
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group memberships (many-to-many relationship between users and groups)
CREATE TABLE group_memberships (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, group_id)
);

-- Boards table (add group_id for group-specific moderation)
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  moderator_group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL, -- Group responsible for moderating this board
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table (unchanged)
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- Status: active, locked, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table (unchanged)
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- Status: active, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table (supports both roles and groups)
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20) NOT NULL, -- 'role' or 'group'
  entity_id VARCHAR(100) NOT NULL, -- Role name (e.g., 'admin') or group ID
  resource_type VARCHAR(50) NOT NULL, -- e.g., 'board', 'topic', 'comment'
  resource_id INTEGER, -- Optional: specific resource ID (e.g., board ID)
  action VARCHAR(50) NOT NULL, -- e.g., create, read, update, delete
  allowed BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(entity_type, entity_id, resource_type, resource_id, action)
);