/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import { Server } from 'socket.io'
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
// import { rateLimiter } from 'hono-rate-limiter';
import { scriptHtml02 } from './routes/pages.js';
import module_routes from './pg/routes/index.js';
import { initMaintenanceState, maintenanceMiddleware } from './pg/utils/pg_maintenance.js';
// import { maintenanceMiddleware } from './utils/maintenance.js';
const PORT = process.env.PORT || 3000;
const app = new Hono({ 
  //strict: false 
});
app.route('/', module_routes);

initMaintenanceState();
app.get('/', maintenanceMiddleware, (c) => {
  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

app.use('/*', serveStatic({ root: './public' }));

let typeServer = 'none';
if((typeof process !== 'undefined') && (process.release.name === 'node')){
  typeServer='node';
}
if(typeof Bun == 'object'){
  typeServer='bun';
}

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
    console.log('PGSQL SERVER');
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
