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
  pageAdminSignOut,
  pageAdminSignIn,
} from './components/admin/index.js'
import useFetch from "./libs/useFetch.js";
import { aliasState, loginState, roleState } from "./components/context.js";
import { NotifyManager } from "./components/notify/notify.js";

const { link} = van.tags;

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

if(!document.getElementById("admin_style")){
  van.add(document.head, link({
    id:"admin_style",
    rel:"stylesheet",
    type:"text/css",
    href:"/components/admin/admin.css"
  }))
}

const pageAdmin = () => {

  console.log("ADMIN");

  async function checkUser(){
    try {
      const data = await useFetch(`/api/auth/user`);
      console.log("data: ", data); 
      if(data){
        if(data?.alias){
          aliasState.val = data.alias;
          roleState.val = data.role;
          loginState.val = true;
        }
      }else{
        loginState.val = false;
      }
    } catch (error) {
      console.log("error:", error.message);
    }
  }

  function setupSideBar(){
    document.documentElement.style.setProperty('--sidebar-width', '250px');
  }

  setupSideBar();

  checkUser();

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
      { path: "/admin/signin", component:  pageAdminSignIn},
      { path: "/admin/signout", component:  pageAdminSignOut},
    ]
  });
}

van.add(document.body, pageAdmin());
setTimeout(()=>{
  van.add(document.body, NotifyManager());
},100);