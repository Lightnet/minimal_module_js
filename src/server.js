/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/
// https://github.com/orgs/honojs/discussions/1355
// https://hono.dev/helpers/cookie

import { Server } from 'socket.io'
//import { Server as HttpServer } from 'http'
import { serve } from '@hono/node-server';
// import van from "mini-van-plate/van-plate"
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
//import { html } from 'hono/html';
//import { logger } from 'hono/logger';
//import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { jwt } from 'hono/jwt'
import { rateLimiter } from 'hono-rate-limiter';

import { scriptHtml02 } from './routes/pages.js';
import module_routes from './sqlite/routes/sqlite_index.js'
import { maintenanceMiddleware } from './sqlite/utils/sqlite_maintenance.js';
const PORT = process.env.PORT || 3000;
// const {head, body, style, script} = van.tags

// middleware for db
// note it reload for every request
export function useDB(options){
  //console.log('config db???')
  //console.log(options);
  let _db;
  if(options){
    if(options.db){
      _db = options.db;
    }
  }
  //layer by layer
  return async (c, next) => {
    //console.log('set db???')
    c.set('db',_db)
    await next();
  }
}

// Web Fetch Server
const app = new Hono({ 
  //strict: false 
});

// // Apply the rate limiting middleware to all requests.
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     // limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     limit: 1000,
//     standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//     keyGenerator: (c) => {
//       // console.log(c);
//       // console.log("unique_key");
//       return "<unique_key>"
//     },
//   })
// );

app.use('/auth/*',
  jwt({
    secret: process.env.JWT_SECRET || 'SECRET',
    cookie:'token'
  })
)

//middleware
//note this will request every action if set to '*' to allow all url
// app.use('*',useDB({
//   db:db,
// }));

//app.use('*', logger())
//app.use('*', async (c, next) => {
  //console.log(`[${c.req.method}] ${c.req.url}`)
  //await next()
//})
//

app.route('/', module_routes);
//<script type="module" src="/client.js"></script>
app.get('/', maintenanceMiddleware, (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

//set up static folder for public access
app.use('/*', serveStatic({ root: './public' }));

//wild card url for router vanjs added last
// app.use('/*',  (c) => {
//   //const db = c.get('db');
//   //console.log('db', db);
//   //return c.text('Hono!')
//   const pageHtml = scriptHtml02("/index.js");
//   return c.html(pageHtml);
// });

//https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
let typeServer = 'none';
if((typeof process !== 'undefined') && (process.release.name === 'node')){
  typeServer='node';
}
if(typeof Bun == 'object'){
  typeServer='bun';
}

// https://github.com/orgs/honojs/discussions/1781
// server base on bun api by fetch
if (process.env.NODE_ENV !== 'test') {
  if(typeServer=='node'){
    const server = serve({
      fetch: app.fetch,
      port:PORT
    });
    const io = new Server(server);

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    //console.log(io);
    console.log('Process Type:',typeServer);
    console.log('SQLITE');
    let urlList = [
      `http://localhost:${PORT}`,
      `http://localhost:${PORT}/admin`,
    ];
    for(var myurl in urlList){
      console.log(urlList[myurl]);
    }
  }
}

export default app