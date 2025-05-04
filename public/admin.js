/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/
import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { Page_Admin, Page_Logs, Page_Accounts, Page_Tickets, Page_Reports, Page_Database, Page_Settings } from "/components/admin/admin_access.js";
import { Page_Backup } from "./components/admin/admin_access.js";

//import useFetch from "../libs/useFetch.js";
// import { UIStyle } from "/components/theme/theme.js";
const {button, div, pre, p, link} = van.tags;

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


const PageAdmin = () => {
  
  console.log("ADMIN");

  if(!document.getElementById("admin_style")){
    van.add(document.head, link({
      id:"admin_style",
      rel:"stylesheet",
      type:"text/css",
      href:"/components/admin/admin.css"
    }))
  }

  return Router({
    routes: [
      { path: "/admin", component:  Page_Admin},
      { path: "/admin/logs", component:  Page_Logs},
      { path: "/admin/accounts", component:  Page_Accounts},
      { path: "/admin/tickets", component:  Page_Tickets},
      { path: "/admin/reports", component:  Page_Reports},
      { path: "/admin/database", component:  Page_Database},
      { path: "/admin/settings", component:  Page_Settings},
      { path: "/admin/backup", component:  Page_Backup},
    ]
  })
}

// van.add(document.head, UIStyle);
van.add(document.body, PageAdmin());
