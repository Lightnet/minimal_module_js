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

function pageAccounts() {

  const auditlogs = tbody()
  async function fetchLogs(){
    try {
      const data = await useFetch('/api/admin/accounts');
      console.log("data: ",data)
      for(const item of data){
        van.add(auditlogs,
          tr(
            td(item.id),
            td(item.username),
            td(item.role),
            td(item.status),
            td(item.created_at),
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
    div({ class: "admin-content" },
      label("Accounts Page"),
      table(
        thead(
          tr(
            td("ID"),
            td("User Name"),
            td("Role"),
            td("Status"),
            td("Created At"),
          )
        ),
        auditlogs
      )
    )
  );
}

export default pageAccounts;