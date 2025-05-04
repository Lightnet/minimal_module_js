/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Hono } from 'hono';

const route = new Hono({ 
  //strict: false 
});

//route.get('/page', (c) => {
  //const payload = c.get('jwtPayload')
  //console.log(payload)
  //const token = c.get('token')
  //console.log(token)
  //return c.text('You are authorized')
//})
//test
//route.get('/auth/page', (c) => {
  //const payload = c.get('jwtPayload')
  //console.log(payload)
  //return c.text('You are authorized')
//})

route.get('/setcookie', (c) => {
  setCookie(c, 'token', 'test',{
    httpOnly:true
  });
  return c.text('Hono!')
})

route.get('/getcookie', (c) => {
  const token = getCookie(c, 'token')
  console.log(token);
  return c.text('Hono!')
})

route.get('/delcookie', (c) => {
  deleteCookie(c, 'token')
  return c.text('Hono!')
})

route.get('/test', (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

route.post('/login', async (c) => {
  return c.json({ api:"test" });
});

export default route;