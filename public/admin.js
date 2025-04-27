/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { THREE, ECS, van } from "/dps.js";
import { Page_Admin, Page_Logs, Page_Accounts, Page_Tickets, Page_Reports, Page_Database, Page_Settings } from "/components/admin/admin_access.js";

//import useFetch from "../libs/useFetch.js";
import { UIStyle } from "/components/theme/theme.js";
const {button, div, pre, p, link} = van.tags;

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
    ]
  })
}

van.add(document.head, UIStyle);
van.add(document.body, PageAdmin());
