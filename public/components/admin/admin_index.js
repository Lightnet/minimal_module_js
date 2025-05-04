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
const {button, div, span, label,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

function pageIndex() {
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div(
      { class: "main-content" },
      label("Welcome to the Admin Panel"),
      ButtonMaintenanceMode()
    )
  );
}

function ButtonMaintenanceMode() {
  function btn_Maintenance_on() {
    console.log("Maintenance Mode On");
  }

  function btn_Maintenance_off() {
    console.log("Maintenance Mode Off");
  }

  return div(
    label("Maintenance Mode "),
    button({ class: "btn-ok", onclick: btn_Maintenance_on }, " On "),
    button({ class: "btn-cancel", onclick: btn_Maintenance_off }, " Off ")
  );
}

export default pageIndex;