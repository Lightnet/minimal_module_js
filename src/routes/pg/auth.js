/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { adminCreateUser, checkUserExists, login, signup } from '../../models/pg/pg_user.js';

const route_auth = new Hono({ 
  //strict: false
});

route_auth.post('/api/auth/signup', async (c) => {

  const data = await c.req.json()
  if(data){
    if((data.alias !=null)&&(data.username !=null)&&(data.passphrase !=null)&&(data.email !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      const user = await checkUserExists({
        username: data.username, 
        email:data.email
      });
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
  }else{
    return c.json({api:"ERROR"});
  }

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

route_auth.post('/api/auth/signout', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    // console.log("tokenCookie: ", tokenCookie);
    deleteCookie(c, 'token');
    return c.json({api:"PASS"});
  }

  return c.json({api:"ERROR"});
});

route_auth.get('/api/auth/user', async (c) => {

  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    try {
      var userToken = await verify(tokenCookie, process.env.JWT_SECRET || 'SECRET');

      return c.json({
        api:"PASS",
        alias:userToken.alias,
        role:userToken.role
      });
    } catch(err) {
      // err
      console.log("error:",err.message);
      return c.json({api:"ERROR"});
    }
  }
  return c.json({api:"ERROR"});
});




export default route_auth;