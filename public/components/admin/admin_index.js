/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// import { THREE, ECS, van } from "/dps.js";
import van from "vanjs-core";
import { toggleTheme } from "../theme/theme.js";
//import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from '/libs/useFetch.js';
import { AdminNavMenus, Header } from "./admin_layout.js";
import { loginState } from "../context.js";
const {button, div, label} = van.tags;

function pageIndex() {

  const renderLogin = van.derive(()=>{
    if(loginState.val){
      return ButtonMaintenanceMode()
    }else{
      return div('Non Admin.')
    }
  });

  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" },
      label("Welcome to the Admin Panel"),
      renderLogin
    )
  );
}

function ButtonMaintenanceMode() {
  
  async function btn_Maintenance_on() {
    console.log("Maintenance Mode On");
    try {
      const data = await useFetch(`/api/maintenance`,{
        method:'POST',
        body:JSON.stringify({
          enable:true
        })
      });
      console.log("data:", data)
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  async function btn_Maintenance_off() {
    console.log("Maintenance Mode Off");
    console.log("Maintenance Mode On");
    try {
      const data = await useFetch(`/api/maintenance`,{
        method:'POST',
        body:JSON.stringify({
          enable:false
        })
      });
      console.log("data:", data);
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  return div(
    label("Maintenance Mode:"),
    div(
      button({ class: "warn", onclick: btn_Maintenance_on }, " On "),
      button({ class: "btn-cancel", onclick: btn_Maintenance_off }, " Off ")
    ),
    div(
      label("In case of emergency for Maintenance.")
    ),
    div(

    ),
  );
}

export default pageIndex;