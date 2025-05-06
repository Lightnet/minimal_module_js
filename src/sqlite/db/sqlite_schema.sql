-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- Roles: user, moderator, admin
  status TEXT NOT NULL DEFAULT 'active', -- Status: active, muted, banned
  created_at TEXT DEFAULT (datetime('now'))
);

-- Forums table
CREATE TABLE IF NOT EXISTS forums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  creator_id INTEGER NOT NULL,
  moderator_group_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (moderator_group_id) REFERENCES groups(id)
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  forum_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  moderator_group_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (forum_id) REFERENCES forums(id),
  FOREIGN KEY (moderator_group_id) REFERENCES groups(id)
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- Status: active, locked, deleted
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- Status: active, deleted
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Group memberships
CREATE TABLE IF NOT EXISTS group_memberships (
  user_id INTEGER NOT NULL,
  group_id INTEGER NOT NULL,
  joined_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL, -- 'role' or 'group'
  entity_id TEXT NOT NULL, -- Role name or group ID
  resource_type TEXT NOT NULL, -- e.g., 'board', 'topic', 'comment'
  resource_id INTEGER, -- Optional: specific resource ID
  action TEXT NOT NULL, -- e.g., create, read, update, delete
  allowed INTEGER NOT NULL DEFAULT 1, -- 1 for true, 0 for false
  UNIQUE(entity_type, entity_id, resource_type, action)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER, -- User who submitted the report
  resource_type TEXT NOT NULL, -- Type of resource	`topic`, `comment`, `blog`, `user`, `message`, etc.
  resource_id INTEGER NOT NULL, -- ID of the specific resource
  title TEXT NOT NULL, -- Brief summary of the report
  reason TEXT NOT NULL, -- Detailed description of the issue
  status TEXT NOT NULL DEFAULT 'open', -- Status: open, resolved, closed
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
  -- FOREIGN KEY (reporter_id) REFERENCES users(id),
  -- CONSTRAINT valid_resource CHECK (resource_type IN ('topic', 'comment', 'blog', 'user', 'message'))
);

CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER NOT NULL, -- User who submitted the ticket
  resource_type TEXT, -- Optional: Type of resource (e.g., `topic`, `comment`, `blog`, `general`)
  resource_id INTEGER, -- Optional: ID of the specific resource
  title TEXT NOT NULL, -- Brief summary of the ticket
  description TEXT NOT NULL, -- Detailed feedback or suggestion
  category TEXT NOT NULL, -- e.g., `bug`, `feature`, `improvement`, `support`
  priority TEXT NOT NULL DEFAULT 'low', -- e.g., `low`, `medium`, `high`
  status TEXT NOT NULL DEFAULT 'open', -- e.g., `open`, `in_progress`, `resolved`, `closed`
  response TEXT, -- Optional: Admin or support team response
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
  -- FOREIGN KEY (reporter_id) REFERENCES users(id),
  -- CONSTRAINT valid_resource_type CHECK (resource_type IN ('topic', 'comment', 'blog', 'user', 'message', 'general') OR resource_type IS NULL),
  -- CONSTRAINT valid_category CHECK (category IN ('bug', 'feature', 'improvement', 'support')),
  -- CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high')),
  -- CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);

CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title varchar(255) NOT NULL,
  content TEXT NOT NULL,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id varchar(64),
  to_username varchar(64),
  to_user_id varchar(64),
  subject varchar(255) NOT NULL,
  content TEXT NOT NULL,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);