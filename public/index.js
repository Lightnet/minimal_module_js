/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// https://developer.mozilla.org/en-US/docs/Web/CSS/:root
// https://stackoverflow.com/questions/77494641/use-data-theme-variable-value-in-css
import van from "vanjs-core";
import App from "./components/app.js";
import { UIStyle } from "/components/theme/theme.js";
import { NotifyManager } from "./components/notify/notify.js";
const {style, link} = van.tags;

// van.add(document.body, link({
//   id:"forum_style",
//   rel:"stylesheet",
//   type:"text/css",
//   href:"http://localhost:3000/components/forum/forum.css"
// }))

//van.add(document.head, UIStyle);
console.log("init style...");
van.add(document.head, link({
  id:"index_style",
  rel:"stylesheet",
  type:"text/css",
  href:"/components/theme/theme.css"
}));

van.add(document.head, link({
  id:"index_style",
  rel:"stylesheet",
  type:"text/css",
  href:"/components/notify/notify.css"
}));

van.add(document.head, link({
  id:"index_style",
  rel:"stylesheet",
  type:"text/css",
  href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
}))

van.add(document.body, App());
van.add(document.body, NotifyManager());