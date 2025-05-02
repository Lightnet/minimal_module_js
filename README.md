# minimal_module_js

# License: MIT

# Status:
- unstable
- work in progress auths, groups and permissions.

# Information:
  Work in progress. Using minimal packages in style vanilla js.

  Current Forum test build.

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

# Page Admin
- [ ] Server status
- [ ] Database
- [ ] Loggings
- [ ] Members
- [ ] Permissions
- [ ] Ban List
- [ ] Forums
- [ ] Novels
- [ ] Monitor
- [ ] Tickets
- [ ] Report
  - [ ] layout

# Forum 
- [ ] permission (wip)
    - [ ] members
- [ ] settings (n/a)
    - [ ] cookies
    - [ ] theme
- [ ] Forum
    - [x] create
    - [x] update
    - [x] delete
    - [ ] report
    - [x] permission (wip)
- [x] Board
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [ ] report
    - [ ] permissions
    - [x] get forum id by boards
- [x] Topic
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [ ] report
    - [ ] permission forum
    - [x] get board id by topics
- [x] Comment
    - [x] nav menu
    - [x] create
    - [x] update
    - [x] delete
    - [ ] report
    - [ ] permission forum
    - [x] get topic id by comments
  - Nav Menu

# Images:

![Desktop](screenshots/basic_modulejs01.png)
![Mobile](screenshots/basic_modulejs02.png)

# Credits:
 * Grok 3 AI model.
    * auth
    * permission
 * https://vanjs.org
 * 

