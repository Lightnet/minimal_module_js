# minimal_module_js

# License: MIT

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

# Pages:
- [ ] Home
  - [ ] fetch data
- [ ] Blog
  - [ ] fetch data
- [ ] Account
  - [ ] fetch data
- [ ] Message
  - [ ] fetch data
- [ ]- Forum
  - [x] fetch data
  - [x] layout
- [ ] Novels
- [ ] Sign in
  - [ ] fetch data
- [ ] Sign up
  - [ ] fetch data
- [ ] Recovery
  - [ ] fetch data
- [ ] test
  - [x] notify test

# Page Admin
- [ ] Server status
  - [ ] layout
- [ ] Database
  - [ ] layout
- [ ] Loggings
  - [ ] layout
- [ ] Members
  - [ ] layout
- [ ] Permissions
  - [ ] layout
- [ ] Ban List
  - [ ] layout
- [ ] Forums
  - [ ] layout
- [ ] Novels
  - [ ] layout
- [ ] Monitor
  - [ ] layout
- [ ] Tickets
  - [ ] layout
- [ ] Report
  - [ ] layout

# Forum 
- [ ] permission
- [ ] settings
- [ ] Forum
    - [x] create forum
    - [x] Boards
        - [x] nav menu
        - [x] create board
        - [x] get forum id by boards
        - [x] Topic
          - [x] nav menu
          - [x] create topic
          - [x] get board id by topics
          - [x] Comment
              - [x] create comment
              - [x] get topic id by comments

# Novel
- [ ] Books
    - [ ] Book
        - [ ] Table of content
        - [ ] Next Page
        - [ ] Previst Page
- [ ] User books
  - [ ] Create book
  - [ ] Edit book
  - [ ] Books
      - [ ] Pages

# Images:

![Desktop](screenshots/basic_modulejs01.png)
![Mobile](screenshots/basic_modulejs02.png)

# Credits:


