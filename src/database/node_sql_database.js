/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// NODE SQLITE 
// https://www.sqlite.org/datatype3.html
// SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true).


import Database from 'better-sqlite3';
import { compareHashPassword, hashPassword, nanoid } from '../helpers.js';
import { v4 as uuidv4 } from 'uuid';

//sqlite
class SQLDB{

  static db = null;

  constructor(){
    this.initDB();
    this.create_table_user()
    this.create_table_groups()
    this.create_table_group_memberships()
    this.create_table_permissions()
    //this.create_table_preset_permissions()

    this.create_table_blog();
    this.create_table_forum();
    this.create_table_board();
    this.create_table_topic();
    this.create_table_comment();

    this.create_table_report();

    this.create_table_project();
    this.create_table_project_config();
    this.create_table_scene();
    this.create_table_entity();
    this.create_table_script();

    this.create_table_message();

    this.create_table_novel_book();
    this.create_table_novel_page();

    return this;
  }

  initDB(){
    if (this.db == null){
      //console.log("init DB")
      this.db = new Database('database.sqlite', { 
        //verbose: console.log 
      });
    }
  }

  async create_table_user(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS users (
      id varchar(64) PRIMARY KEY UNIQUE,
      alias varchar(32) NOT NULL UNIQUE,
      username varchar(32) NOT NULL UNIQUE,
      passphrase varchar(255),
      salt varchar(255) NOT NULL,
      hash varchar(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email varchar(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user', -- Roles: user, moderator, admin
      status VARCHAR(20) NOT NULL DEFAULT 'active', -- Status: active, muted, banned
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  // async create_table_groups(){
  //   await this.db.exec(`CREATE TABLE IF NOT EXISTS users`);
  // }
  async create_table_groups(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_group_memberships(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS group_memberships (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, group_id)
    );`);
  }

  async create_table_permissions(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      entity_type VARCHAR(20) NOT NULL, -- 'role' or 'group'
      entity_id VARCHAR(100) NOT NULL, -- Role name (e.g., 'admin') or group ID
      resource_type VARCHAR(50) NOT NULL, -- e.g., 'board', 'topic', 'comment'
      resource_id INTEGER, -- Optional: specific resource ID (e.g., board ID)
      action VARCHAR(50) NOT NULL, -- e.g., create, read, update, delete
      allowed BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE(entity_type, entity_id, resource_type, resource_id, action)
    );`);
  }

  async create_table_preset_permissions(){
    await this.db.exec(`-- Role-based permissions
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
  ('group', '2', 'topic', NULL, 'create', TRUE);`);
  }

  async create_table_blog(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }
  // https://stackoverflow.com/questions/54686650/in-sqlite-what-is-the-maximum-capacity-of-text/54687265
  // 65535 characters (or 64Kbytes).
  async create_table_report(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS report (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      sumbittype varchar(255) NOT NULL,
      content TEXT(65535) NOT NULL,
      isdone BOOLEAN DEFAULT 0,
      isclose BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_forum(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS forum (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_board(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(255), 
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      description TEXT,
      moderator_group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL, -- Group responsible for moderating this board
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_topic(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS topic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(255), 
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_comment(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(64), 
      aliasId varchar(64),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_message(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS message (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(64), 
      aliasId varchar(64),
      toAlias varchar(64),
      subject varchar(255) NOT NULL,
      content TEXT(65535) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }
//===============================================
// GAME
//===============================================
  async create_table_entity(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS entity (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_scene(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS scene (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_project(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS project (
      id varchar(64) PRIMARY KEY,
      aliasId varchar(255),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_project_config(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS project_config (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(255),
      _key varchar(255) NOT NULL,
      _value text,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_script(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS script (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_novel_book(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS novel_book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_novel_page(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS novel_page (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page INTEGER,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

//===============================================
// USER
//===============================================
  //
  async user_delete_table(){
    await this.db.exec(`DROP TABLE users;`);
  }
  // CHECK IF USER EXIST
  user_exist(_alias){
    let stmt = this.db.prepare(`SELECT * FROM users WHERE alias = ?`)
    const userExist = stmt.get(_alias);
    return userExist;
  }
  // CREATE USER
  user_create(_alias,_username,_passphrase,_email){
    let userID = uuidv4();
    //let salt = uuidv4();
    //let hash = uuidv4();
    const {salt, hash} = hashPassword(_passphrase);

    const stmt = this.db.prepare('INSERT INTO users (id, alias, username, passphrase, email, salt, hash) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(userID, _alias, _username, _passphrase, _email, salt, hash);
    return {api:"CREATED"};
  }
  //USER LOGIN AND RETURN PASS/FAIL  need to return token
  user_signin(_alias,_passphrase){
    let stmt = this.db.prepare(`SELECT * FROM users WHERE alias = ?`);
    const userExist = stmt.get(_alias);
    if(userExist){
      //
      let isPass = compareHashPassword(_passphrase, userExist.hash,userExist.salt);
      console.log("isPass: ", isPass);

      //if(_passphrase == userExist.passphrase){
      if(isPass){
        return {api:"PASS"};
      }else{
        return {api:"DENIED"};
      }
    }else{
      return {api:"NONEXIST"};
    }
  }

  get_user_info(_alias){
    let stmt = this.db.prepare(`SELECT id, alias, role, create_at FROM users WHERE alias = ?`)
    const userExist = stmt.get(_alias);
    return userExist;
  }

//===============================================
// BLOG
//===============================================
  blog_create(_title,_content){
    const stmt = this.db.prepare('INSERT INTO blog (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  get_blogs(){
    let stmt = this.db.prepare(`SELECT * FROM blog;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  blog_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM blog WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  blog_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE blog SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
//===============================================
// REPORT
//===============================================
create_message(_aliasid, _toalias, _subject,_content){
  const stmt = this.db.prepare('INSERT INTO message (toAlias, subject, content) VALUES (?, ?, ?)');
  stmt.run(_toalias, _subject, _content);
  return {api:"CREATED"};
}

get_messages(){
  let stmt = this.db.prepare(`SELECT * FROM message;`);
  const result = stmt.all();
  //console.log(result);
  return result;
}

delete_message(_id){
  try{
    const stmt = this.db.prepare('DELETE FROM message WHERE id=?')
    stmt.run(_id);
    return {api:'DELETE'};
  }catch(e){
    return {api:'DBERROR'};
  }
}
//===============================================
// REPORT
//===============================================
  create_report(_title,_content){
    const stmt = this.db.prepare('INSERT INTO report (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  get_reports(){
    let stmt = this.db.prepare(`SELECT * FROM report;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }
//===============================================
// FORUM
//===============================================
  //=============================================
  // FORUM
  get_forums(){
    let stmt = this.db.prepare(`SELECT * FROM forum;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  forum_create(_title,_content){
    const stmt = this.db.prepare('INSERT INTO forum (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  forum_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM forum WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  forum_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE forum SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
  // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
  get_forumID(_id){
    try{
      let stmt = this.db.prepare(`SELECT * FROM board WHERE parentid=?;`);
      //stmt.run(_id);
      //const result = stmt.all();

      const result = stmt.all(_id);
      console.log(result);
      return result;
      //return {api:'PK'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
//===============================================
// BOARD
//===============================================
  get_boards(){
    let stmt = this.db.prepare(`SELECT * FROM board;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  get_boardID(_id){
    let stmt = this.db.prepare(`SELECT * FROM topic WHERE parentid=?;`);
    const result = stmt.all(_id);
    //console.log(result);
    return result;
  }

  board_create(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO board (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
  }

  board_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM board WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  board_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE board SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
//===================================
// FORUM TOPIC
//===================================
  create_topic(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO topic (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
  }

  get_TopicID(_id){
    let stmt = this.db.prepare(`SELECT * FROM comment WHERE parentid=?;`);
    const result = stmt.all(_id);
    //console.log(result);
    return result;
  }

  topic_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE topic SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }

  topic_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM topic WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }
//===================================
// FORUM COMMENT
//===================================
  create_comment(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO comment (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
  }

  comment_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE comment SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }

  comment_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM comment WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

}
//===============================================
// EXPORT
//===============================================
export default SQLDB;
// https://github.com/honojs/middleware/tree/main/packages/hello
// https://github.com/honojs/middleware
export function useDB(options){
  //console.log('config db???');
  //console.log(options);
  let _db;
  if(options){
    if(options.db){
      _db = options.db;
    }
  }

  return async (c, next) => {
    //console.log('set db???')
    c.set('db',_db)
    await next();
  }
}
