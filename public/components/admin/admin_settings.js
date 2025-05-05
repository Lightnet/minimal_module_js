/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// import { THREE, ECS, van } from "/dps.js";
import van from "vanjs-core";
// import { toggleTheme } from "../theme/theme.js";
//import van from "vanjs-core";
// import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
// import useFetch from '/libs/useFetch.js';
import { AdminNavMenus, Header } from "./admin_layout.js";
const {button, div, span, label} = van.tags;

function pageSettings() {
  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "admin-content" }, 
      label("Settings Page")
    )
  );
}

export default pageSettings;