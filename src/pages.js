/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
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
      script({src:"https://unpkg.com/three@0.170.0/examples/jsm/libs/ammo.wasm.js"}),
      script({type:"importmap"},`{
  "imports": {
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://cdn.skypack.dev/ecs",
    "vanjs-core":"https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js",
    "van":"https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.2.min.js",
    "vanjs-ui":"https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js",
    "vanjs-ext":"https://cdn.jsdelivr.net/npm/vanjs-ext@0.6.1/src/van-x.js",
    "vanjs-routing":"https://cdn.jsdelivr.net/npm/vanjs-routing@1.1.3/dist/index.min.js"
  }
}
`),
    ),
    body(
      script({type:"module",src:_script})
    ),
  );

  return pageHtml;
}

function scriptHtml03(_script){
  // background:gray;
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
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://unpkg.com/ecs@0.23.0/ecs.js"
  }
}
`),
    ),
    body(
      script({src:"https://unpkg.com/three@0.170.0/examples/jsm/libs/ammo.wasm.js"}),
      script({type:"module",src:_script}),
    ),
  );

  return pageHtml;
}

// route.get('/threeammo', (c) => {
//   //const db = c.get('db');
//   const pageHtml = scriptHtml03("/van_threeammo.js");
//   return c.html(pageHtml);
// });
// https://threejs.org/docs/index.html#manual/en/introduction/Installation

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

export default route;
export {
  scriptHtml02
}