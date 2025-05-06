/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// pages for url
// import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Hono } from 'hono';
import van from "mini-van-plate/van-plate";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {head, body, style, script} = van.tags
const route = new Hono();

function scriptHtml02(_script){
  //background:gray;
  const pageHtml = van.html(
    head(
      style(`
      body{
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`{ 
  "imports": {
    "vanjs-core":"https://cdn.jsdelivr.net/npm/vanjs-core@1.5.5/src/van.min.js",
    "van":"https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.5.min.js",
    "vanjs-ui":"https://cdn.jsdelivr.net/npm/vanjs-ui@0.11.11/dist/van-ui.min.js",
    "vanjs-ext":"https://cdn.jsdelivr.net/npm/vanjs-ext@0.6.2/src/van-x.js",
    "vanjs-routing":"https://cdn.jsdelivr.net/npm/vanjs-routing@1.1.4/dist/index.min.js"
  }
}`),
    ),
    body(
      script({type:"module",src:_script})
    ),
  );

  return pageHtml;
}

var urlandjs = [
  // {url:'/admin/logs',         file:'/admin.js'},
  // {url:'/admin/accounts',     file:'/admin.js'},
  // {url:'/admin/tickets',      file:'/admin.js'},
  // {url:'/admin/report',       file:'/admin.js'},
  // {url:'/admin/settings',     file:'/admin.js'},
  {url:'/admin',                                      file:'/admin.js'},
  {url:'/chat',                                       file:'/van_chat.js'},
  {url:'/login',                                      file:'/login.js'}
];

//console.log("URLS...");
route.get("/:name", (c, next) => {
  let isFound = false;
  const name = c.req.param('name');
  // console.log(name);
  let file = '';
  for (var idx in urlandjs){
    if(urlandjs[idx].url.match(name)){
      //console.log("match...")
      file = urlandjs[idx].file;
      isFound=true;
      //console.log(file);
      break;
    }
  }
  //const db = c.get('db');
  //console.log("http://localhost:3000/"+name);
  if(isFound){
    const pageHtml = scriptHtml02(file);
    return c.html(pageHtml);
  }
  //return c.html('None');
  return next();
});

// route.get("/auth/jwt", (c, next) => {
//   const payload = c.get('jwtPayload')
//   console.log("payload: ", payload);
//   return c.text('test jwt')
// });

// route.get("/jwt", (c, next) => {
//   const payload = c.get('jwtPayload')
//   console.log("payload: ", payload);
//   return c.text('test jwt')
// });

export default route;
export {
  scriptHtml02
}