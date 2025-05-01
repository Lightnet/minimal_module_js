# minimal_module_js

# License: MIT

# Status:
- unstable
- reworking server side forum and auth.

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

# Module:
- [x] notify
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
  - [ ] sent message
  - [ ] delete message
  - [ ] blacklist alias
- [ ] Auth
  - [ ] Account
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
- [ ] permission
    - [ ] members
- [ ] settings
    - [ ] cookies
    - [ ] theme
- [ ] Forum
    - [x] create forum
    - [x] update forum
    - [x] delete forum
    - [ ] report
    - [ ] permission forum
- [x] Board
    - [x] nav menu
    - [x] create board
    - [x] update Board
    - [x] delete Board
    - [ ] report
    - [ ] permission forum
    - [x] get forum id by boards
- [x] Topic
    - [x] nav menu
    - [x] create Topic
    - [x] update Topic
    - [x] delete Topic
    - [ ] report
    - [ ] permission forum
    - [x] get board id by topics
- [x] Comment
    - [x] nav menu
    - [x] create comment
    - [x] update Comment
    - [x] delete Comment
    - [ ] report
    - [ ] permission forum
    - [x] get topic id by comments
  - Nav Menu

# Images:

![Desktop](screenshots/basic_modulejs01.png)
![Mobile](screenshots/basic_modulejs02.png)

# Credits:


