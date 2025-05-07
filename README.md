# minimal_module_js

# License: MIT

# Packages:
- vanjs 1.5.5
- uuid 11.1.0
- better-sqlite3 11.9.1
- nanoid 5.1.5
- hono 4.7.7
- @hono/node-server 1.14.1
- socket.io 4.8.1
- dotenv 16.5.0
- jsonwebtoken 9.0.2

# Status
- Unstable: Work in progress.
- Focus Areas:
    - Authentication, groups, and permissions.
    - Testing framework for REST API (forum functionality).
    - Database failover: SQLite as fallback for PostgreSQL.

# Information:
  Work in progress. Using minimal packages in vanilla javascript, type module and import.

# Project Goals
- Build a simple, reactive forum and messaging system with minimal bandwidth usage.
- Prioritize security (e.g., flood/spam protection) and simplicity for testing builds.
- Support modular plugins (future consideration).
- Ensure database reliability with SQLite as a fallback for PostgreSQL.

# Testing Framework

- Purpose: Validate core forum functionality (boards, topics, comments) for CRUD operations.
- Current Tests:
    - Notify module tests.
- Planned:
    - Full REST API tests for forum, authentication, and permissions.
    - Automated scripts to simulate user interactions.

# Audit Logging
 Simple audit logging inspired by the Grok 3.0 AI model. Logs user actions like group creation.

## Example:
```js
import { logAudit } from '../../utils/audit.js';
//...
logAudit(user.id, 'create_group', {
  group_id: newGroup.id, 
  name,
  description
});
```
# Development

- Scripts:
    - npm start: Start the Hono server.
    - npm test: Run the testing framework (WIP).
- Directory Structure:
    - src/: Core application logic.
    - public/: Static assets (CSS, JS, images).
    - utils/: Helper functions (audit, backup, etc.).


## File Size:
- node_modules 49.0 MB
- public 288 KB
- src 192 KB

# Module:
- [x] notify
  - [x] css
    - [x] animation slide
  - [x] context
    - [x] timeToDelete 600
    - [x] timeToClose 1000 * 10
    - [x] animToClose = timeToClose - timeToDelete;
  - [x] NotifyContainer (notice message html)
  - [x] NotifyManager (handle messages element ancher)
  - [x] notify (set variable args to push message notice)
- [ ] audit logs
  - [x] logAudit
  - [ ] layout
  - [ ] backup
- [ ] theme
  - [x] light
  - [x] dark
  - [x] toggle theme
  - [x] check theme
  - [ ] custom color
- [ ] Message
  - [x] sent message
  - [ ] delete message
  - [ ] blacklist alias
- [ ] Auth
  - [x] Account (simple username)
  - [x] Sign in
  - [x] Sign up
  - [ ] Recovery
- [ ] Blog
- [ ] Novels
- [ ] test
  - [x] notify test
- [ ] Book
    - [ ] Table of content
    - [ ] Next Page
    - [ ] Previst Page
    - [ ] Create book
    - [ ] Edit book
    - [ ] Books
    - [ ] Pages
- [ ] backup
  - [ ] layout
  - [x] save
  - [x] save table name
  - [ ] load / restore
- [ ] report
  - [x] create
  - [x] update
  - [x] delete
  - [ ] forum
  - [ ] access
- [ ] ticket
  - [x] create
  - [x] update
  - [x] delete
  - [ ] access

# Page Admin
- [ ] Server status
- [ ] Database
- [ ] Loggings
  - [x] simple audit logs
- [ ] Accounts
  - [x] layout
- [ ] Groups
  - [x] layout
- [ ] Permissions
  - [x] layout
- [ ] Novels
- [ ] Monitor
- [ ] Tickets
  - [x] layout
- [ ] Report
  - [x] layout

# Forum 
- [ ] groups 
    - [ ] members
    - [x] add 
    - [x] delete
    - [ ] update
- [ ] permission 
    - [ ] members
    - [x] add 
    - [x] delete
    - [ ] update
- [ ] settings (n/a)
    - [ ] cookies
    - [ ] theme
- [ ] Forum
    - [x] create
    - [x] update
    - [x] delete
- [x] Board
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [x] get forum id by boards
- [x] Topic
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [x] report
    - [x] get board id by topics
- [x] Comment
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [x] report
    - [x] get topic id by comments
  - Nav Menu

# Images:

![Desktop](screenshots/basic_modulejs01.png)
![Mobile](screenshots/basic_modulejs02.png)

# Credits:
 * Grok 3 AI model.
    * auth
    * permission
    * group
 * https://vanjs.org

# Roadmap
- Complete authentication (recovery, advanced permissions).
- Implement full database failover PostgreSQL (just idea for low small group of people using it.)
- Finish testing framework for REST API.
- Add settings (cookies, themes) and reporting features.
- Explore plugins/mods for extensibility.