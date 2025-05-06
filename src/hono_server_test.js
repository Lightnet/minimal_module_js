/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// refs
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const topicRoutes = require('./routes/topics');
const commentRoutes = require('./routes/comments');
const groupRoutes = require('./routes/groups');
const forumRoutes = require('./routes/forums');

const app = new Hono();

app.route('/auth', authRoutes);
app.route('/boards', boardRoutes);
app.route('/topics', topicRoutes);
app.route('/comments', commentRoutes);
app.route('/groups', groupRoutes);
app.route('/forums', forumRoutes);

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
}).then(() => console.log(`Server running on port ${process.env.PORT || 3000}`));