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

function pageBackup() {

  async function cBackUp(){
    try {
      const data = await useFetch(`/api/backup`);
      console.log(data)  
    } catch (error) {
      console.log("error:", error.message);
    }
  }

  async function cBackupTableName(name){
    try {
      const data = await useFetch(`/api/backup-table/${name}`);
      console.log(data);
    } catch (error) {
      console.log("error table name:", error.message);
    }
  }

  async function cFetchTables(){
    try {
      const data = await useFetch(`/api/backup/tables`);
      console.log(data)  
      if(data?.tables){
        let _tablebody = document.getElementById(`sqltable`);
        const parentNode = _tablebody;
        while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
        }

        for(const item of data.tables){
           van.add(_tablebody,
            tr(
              td(`${item}`),
              td(
                button({onclick:()=>cBackupTableName(item)},"backup")
              ),
            )
           )
        }
      }
    } catch (error) {
      console.log("error:", error.message);
    }
  }

  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" },
      div(
        label("Backup Page"),
      ),
      div(
        button({class:"normal",onclick:cBackUp},`Back Up`),
        button({class:"warn",onclick:()=>{}},`Restore`)
      ),
      div(
        button({class:"normal",onclick:cFetchTables},`Get Tables`)
      ),
      table(
        thead(
          tr(
            td("Name:"),
            td("Actions:"),
          )
        ),
        tbody({id:"sqltable"})
      )
    )
  );
}

export default pageBackup;
