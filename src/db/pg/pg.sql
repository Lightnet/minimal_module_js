-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- Roles: user, moderator, admin
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- Status: active, muted, banned
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table (defined before forums and boards due to foreign key dependencies)
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forums table
CREATE TABLE IF NOT EXISTS forums (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  creator_id INTEGER NOT NULL,
  moderator_group_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (moderator_group_id) REFERENCES groups(id)
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  forum_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  moderator_group_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (forum_id) REFERENCES forums(id),
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (moderator_group_id) REFERENCES groups(id)
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- Status: active, locked, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL,
  user_id INTEGER,
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- Status: active, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Group memberships
CREATE TABLE IF NOT EXISTS group_memberships (
  user_id INTEGER NOT NULL,
  group_id INTEGER NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'role' or 'group'
  entity_id TEXT NOT NULL, -- Role name or group ID
  resource_type VARCHAR(50) NOT NULL, -- e.g., 'board', 'topic', 'comment'
  resource_id INTEGER, -- Optional: specific resource ID
  action VARCHAR(50) NOT NULL, -- e.g., create, read, update, delete
  allowed BOOLEAN NOT NULL DEFAULT TRUE, -- true for allowed, false for denied
  CONSTRAINT unique_permission UNIQUE (entity_type, entity_id, resource_type, action)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER, -- User who submitted the report
  resource_type VARCHAR(50) NOT NULL, -- Type of resource: topic, comment, blog, user, message, etc.
  resource_id INTEGER NOT NULL, -- ID of the specific resource
  title TEXT NOT NULL, -- Brief summary of the report
  reason TEXT NOT NULL, -- Detailed description of the issue
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- Status: open, resolved, closed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT valid_resource CHECK (resource_type IN ('topic', 'comment', 'blog', 'user', 'message'))
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER NOT NULL, -- User who submitted the ticket
  resource_type VARCHAR(50), -- Optional: Type of resource (e.g., topic, comment, blog, general)
  resource_id INTEGER, -- Optional: ID of the specific resource
  title TEXT NOT NULL, -- Brief summary of the ticket
  description TEXT NOT NULL, -- Detailed feedback or suggestion
  category VARCHAR(50) NOT NULL, -- e.g., bug, feature, improvement, support
  priority VARCHAR(50) NOT NULL DEFAULT 'low', -- e.g., low, medium, high
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- e.g., open, in_progress, resolved, closed
  response TEXT, -- Optional: Admin or support team response
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT valid_resource_type CHECK (resource_type IN ('topic', 'comment', 'blog', 'user', 'message', 'general') OR resource_type IS NULL),
  CONSTRAINT valid_category CHECK (category IN ('bug', 'feature', 'improvement', 'support')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  to_username VARCHAR(64),
  to_user_id INTEGER,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);