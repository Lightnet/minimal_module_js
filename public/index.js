/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://developer.mozilla.org/en-US/docs/Web/CSS/:root
// https://stackoverflow.com/questions/77494641/use-data-theme-variable-value-in-css
import van from "vanjs-core";
import App from "./components/app.js";
import { UIStyle } from "/components/theme/theme.js";
const {style, link} = van.tags;

// van.add(document.body, link({
//   id:"forum_style",
//   rel:"stylesheet",
//   type:"text/css",
//   href:"http://localhost:3000/components/forum/forum.css"
// }))

van.add(document.head, UIStyle);
van.add(document.body, App());