/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//https://hono.dev/guides/middleware

//AUTH STUFF
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
const app = new Hono({ 
  //strict: false 
});
import { checkUserExists, login, signup } from '../models/sqlite/sdlite_user.js';

app.use("*", checkAccess);

app.post('/api/auth/signup', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  console.log(data);
  //return c.text('Hono!')
  if(data){
    if((data.alias !=null)&&(data.username !=null)&&(data.passphrase !=null)&&(data.email !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      const db = c.get('db');
      // const user = db.user_exist(data.alias);
      const user = checkUserExists({
        username: data.alias, 
        email:data.email
      });
      console.log("user DB");
      console.log(user);
      if(user){
        console.log('EXIST');
        return c.json({api:'EXIST'});
      }else{
        console.log("CREATE USER SQL...")
        // const result = db.user_create(data.alias,data.username,data.passphrase, data.email);
        const result = signup(data.alias, data.email ,data.passphrase);
        // return c.json(result);
        return c.json({api:'CREATE'});
      }
    }
  }
  return c.json({api:"ERROR"});
})

app.post('/api/auth/signin', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  console.log(data);
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      const db = c.get('db');
      // const result = db.user_signin(data.alias, data.passphrase);
      try {
        const result = await login(data.alias, data.passphrase); 
        if(result){
          console.log("PASS", result);
          let token = { id: data.id, alias: data.alias, role: data.role };
          token = jwt.sign(token, process.env.JWT_SECRET || 'SECRET', {
            expiresIn: '1d',
          });
          // token=JSON.stringify(token);
          setCookie(c, 'token', token,{
            httpOnly:true,
            path:"/"
          });
          return c.json({api:'PASS',alias:data.alias});
          // return c.json(result);
        }else{
          console.log("NOT CORRECT PASS!")
          return c.json({api:'DENIED'});  
        }
        
      } catch (error) {
        return c.json({api:'DENIED'});
      }
      // console.log("user DB");
      // console.log(result);
      // if(result){
      //   if(result?.api=='PASS'){
      //     let token = {alias: data.alias};
      //     token=JSON.stringify(token)
      //     setCookie(c, 'token', token,{
      //       httpOnly:true,
      //       path:"/"
      //     });
      //     return c.json(result);
      //   }else if(result?.api=='NONEXIST'){
      //     return c.json({api:'NONEXIST'}); 
      //   }else{
      //     return c.json({api:'DENIED'});  
      //   }
      // }else{
      //   return c.json({api:'ACCESSNULL'});
      // }
    }else{
      return c.json({api:'ACCESSNULL'});
    }
  }

  //return c.text('Hono!')
  return c.json({api:"ERROR"});
});

// https://hono.dev/helpers/cookie
app.post('/api/auth/signout', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    console.log("tokenCookie: ", tokenCookie)
    deleteCookie(c, 'token');
    return c.json({api:"PASS"});
  }

  return c.json({api:"ERROR"});
});

export async function checkAccess(c, next){
  //console.log("access...");
  //console.log(c);
  await next();
  //console.log("access end...");
}

//get user data that is secure
app.get('/api/auth/user', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    //deleteCookie(c, 'token');
    //console.log('tokenCookie:', tokenCookie);
    //console.log('tokenCookie type:', typeof tokenCookie);
    let jsonCookie = JSON.parse(tokenCookie);
    //console.log('tokenCookie:', jsonCookie);
    //console.log('tokenCookie alias:', jsonCookie.alias);
    return c.json({api:"PASS",alias: jsonCookie.alias});
    //return c.json({api:"PASS"});
  }

  //const data = c.req.query()
  //return c.text('Hono!')
  return c.json({api:"ERROR"});
});

app.get('/api/user', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    console.log("tokenCookie: ", tokenCookie);
    console.log("tokenCookie Type: ", typeof tokenCookie);
    let userToken = JSON.parse(tokenCookie);
    console.log("userToken Type: ", typeof userToken);
    console.log("userToken.alias: ",  userToken.alias);
    
    const db = c.get('db');

    let userData = db.get_user_info(userToken.alias);
    console.log(userData);
    return c.json({api:"PASS",alias:userData.alias, role:userData.role,join: userData.create_at });

    //return c.json({api:"PASS"});
  }

  return c.json({api:"ERROR"});
});

export default app;