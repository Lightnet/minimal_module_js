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

function pageLogs() {
  const auditlogs = tbody()
  async function fetchLogs(){
    try {
      const data = await useFetch('/api/admin/logs');
      console.log("data: ",data)
      for(const item of data){
        van.add(auditlogs,
          tr(
            td(item.id),
            td(item.user_id),
            td(item.created_at),
            td(item.action),
            td(item.details),
          )
        )
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  }
  fetchLogs();

  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, 
      div(label("Logs Page")),
      table(
        thead(
          tr(
            td("ID"),
            td("User ID"),
            td("Created At"),
            td("Actions"),
            td("detail"),
          )
        ),
        auditlogs
      )
    )
  );
}

export default pageLogs;