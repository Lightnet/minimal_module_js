/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Router } from "vanjs-routing";

import {
  pageAccounts,
  pageBackup,
  pageDatabase,
  pageIndex,
  pageLogs,
  pageReports,
  pageSettings,
  pageTickets,
  pageAdminPermissions,
  pageAdminGroups,
} from './components/admin/index.js'

// import useFetch from "../libs/useFetch.js";
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
      { path: "/admin", component:  pageIndex},
      { path: "/admin/groups", component:  pageAdminGroups},
      { path: "/admin/permissions", component:  pageAdminPermissions},
      { path: "/admin/logs", component:  pageLogs},
      { path: "/admin/accounts", component:  pageAccounts},
      { path: "/admin/tickets", component:  pageTickets},
      { path: "/admin/reports", component:  pageReports},
      { path: "/admin/database", component:  pageDatabase},
      { path: "/admin/settings", component:  pageSettings},
      { path: "/admin/backup", component:  pageBackup},
    ]
  })
}

van.add(document.body, PageAdmin());
