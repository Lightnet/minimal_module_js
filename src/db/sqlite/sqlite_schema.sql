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
  UNIQUE(entity_type, entity_id, resource_type, resource_id, action)
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
  aliasId varchar(255),
  title varchar(255) NOT NULL,
  sumbittype varchar(255) NOT NULL,
  content TEXT(65535) NOT NULL,
  isdone BOOLEAN DEFAULT 0,
  isclose BOOLEAN DEFAULT 0,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);