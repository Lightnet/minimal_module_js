/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//https://hono.dev/guides/middleware

//AUTH STUFF
// const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';
import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';

import { adminCreateUser, checkUserExists, login, signup } from '../../models/sqlite_user.js';
import { authenticate } from '../../middleware/sqlite_auth.js';
import { getDB } from '../../db/sqlite_db.js';
// console.log("auth.js")
const route_auth = new Hono({ 
  //strict: false
});

route_auth.post('/api/auth/signup', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  // console.log(data);
  //return c.text('Hono!')
  if(data){
    if((data.alias !=null)&&(data.username !=null)&&(data.passphrase !=null)&&(data.email !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      // const user = db.user_exist(data.alias);
      const user = await checkUserExists({
        username: data.username, 
        email:data.email
      });
      // console.log("user DB");
      // console.log(user);
      if(user){
        console.log('EXIST');
        return c.json({api:'EXIST'});
      }else{
        console.log("CREATE USER SQL!")
        // const result = db.user_create(data.alias,data.username,data.passphrase, data.email);
        const result = signup(data.username, data.email ,data.passphrase);
        // return c.json(result);
        return c.json({api:'CREATE'});
      }
    }
  }
  return c.json({api:"ERROR"});
})

route_auth.post('/api/auth/signin', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  console.log(data);
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      // const db = c.get('db');
      // const result = db.user_signin(data.alias, data.passphrase);
      try {
        const result = await login(data.alias, data.passphrase); 
        if(result){
          // console.log("PASS", result);
          let token = {
            id: result.id, 
            alias: data.alias, 
            role: result.role,
            // expiresIn: '1d',
          };
          // console.log("token: ",token);
          // token = jwt.sign(token, process.env.JWT_SECRET || 'SECRET', {
          //   expiresIn: '1d',
          // });
          token = await sign(token, process.env.JWT_SECRET || 'SECRET');

          // token=JSON.stringify(token);
          setCookie(c, 'token', token,{
            httpOnly:true,
            path:"/"
          });
          // setCookie(c, 'token', token,{
          //   httpOnly:true,
          //   path:"/"
          // });
          return c.json({
            api:'PASS',
            alias:data.alias,
            role:result.role
          });
          // return c.json(result);
        }else{
          console.log("NOT CORRECT PASS!")
          return c.json({api:'DENIED'});  
        }
        
      } catch (error) {
        return c.json({api:'DENIED'});
      }
    }else{
      return c.json({api:'ACCESSNULL'});
    }
  }

  //return c.text('Hono!')
  return c.json({api:"ERROR"});
});

// https://hono.dev/helpers/cookie
route_auth.post('/api/auth/signout', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    // console.log("tokenCookie: ", tokenCookie);
    deleteCookie(c, 'token');
    return c.json({api:"PASS"});
  }

  return c.json({api:"ERROR"});
});

//get user data that is secure
route_auth.get('/api/auth/user', authenticate, async (c) => {
  // const tokenCookie = getCookie(c, 'token');
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    //deleteCookie(c, 'token');
    // console.log('tokenCookie:', tokenCookie);
    try {
      // var decoded = jwt.verify(tokenCookie, 'wrong-secret');
      // var userToken = jwt.verify(tokenCookie, process.env.JWT_SECRET || 'SECRET');
      var userToken = await verify(tokenCookie, process.env.JWT_SECRET || 'SECRET');
      // console.log("userToken");
      // console.log(userToken);

      const db = await getDB();
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const user = stmt.get(userToken.id);

      return c.json({
        api:"PASS",
        alias:userToken.alias,
        role:userToken.role,
        join:user.created_at
      });
    } catch(err) {
      // err
      console.log("error:",err.message);
      return c.json({api:"ERROR"});
    }
  }
  return c.json({api:"ERROR"});
});

//need to fix this later.
route_auth.post('/auth/refresh', authenticate, async (c) => {
  const user = c.get('user');
  const newToken = jwt.sign({ id: user.id,alias:user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  setCookie(c, 'token', newToken, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'Strict' 
  });
  return c.json({ token: newToken });
});
//need to fix this later.
route_auth.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  // console.log("===============================");
  // console.log("email:", email);
  // console.log("password:", password);
  try {
    const user = await login(email, password);
    // console.log("user:=======================");
    // console.log("user: ", user);
    const token = jwt.sign({ id: user.id,alias:user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    // let token = {
    //   test:"test"
    // }
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60,
    });
    // console.log("token: ", token);
    return c.json({api:"PASS", token });
  } catch (error) {
    console.log("error: ==============================");
    console.log("error: ",error.message);
    return c.json({ error: error.message }, 401);
  }
});

// route_auth.post('/login', async (c) => {
//   return c.json({ api:"test" });
// });

export default route_auth;