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

function pageDatabase() {

  const elTables = tbody();
  
  function viewTable(name){
    console.log("name:", name)
  }

  async function getTables(){
    try {
      const data = await useFetch(`/api/database/tables`);
      console.log(data);
      const pNode = elTables;
      while (pNode.firstChild) {
        pNode.removeChild(pNode.firstChild);
      }

      for(const t of data.tables){
        console.log(t);
        van.add(elTables,
          tr(
            td(t),
            td(
              button({onclick:()=>viewTable(t)},"View Table")
            ),
          )
        )
      }
    } catch (error) {
      console.log("error:",error.message);
    }
  }

  return div({class:"container"},
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, 
      label("Database Page"),
      div(
        button({onclick:getTables},"Get Tables")
      ),
      table(
        thead(
          tr(
            td("Name"),
            td("Actions"),
          )
        ),
        elTables,
      )
    )
  );
}

export default pageDatabase;
