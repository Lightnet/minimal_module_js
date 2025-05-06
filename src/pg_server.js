import { Server } from 'socket.io'
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { jwt } from 'hono/jwt'
// import { rateLimiter } from 'hono-rate-limiter';
import { scriptHtml02 } from './routes/pages.js';
// import module_routes from './routes/sqlite/index.js';
import module_routes from './pg/routes/index.js';
// import { maintenanceMiddleware } from './utils/maintenance.js';
const PORT = process.env.PORT || 3000;
console.log("pg server");
const app = new Hono({ 
  //strict: false 
});
app.route('/', module_routes);
// app.get('/', maintenanceMiddleware, (c) => {
//   const pageHtml = scriptHtml02("/index.js");
//   return c.html(pageHtml);
// });

app.get('/', (c) => {
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
    console.log('Process Type:',typeServer)
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
