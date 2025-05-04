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
import { El_CreateReportForm } from "../report/report.js";
import { AdminNavMenus, Header } from "./admin_layout.js";
const {button, div, span, label,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

// Mock dependencies (replace with actual imports)
// const El_CreateReportForm = () => van.tags.div("Report Form Placeholder");
// const useFetch = async (url) => {
//   // Mock API response
//   return [
//     { id: 1, title: "Report 1", content: "Content 1", isdone: false, isclose: false },
//     { id: 2, title: "Report 2", content: "Content 2", isdone: true, isclose: false },
//   ];
// };

function Page_Admin() {
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

function Page_Logs() {
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

function Page_Accounts() {
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, label("Accounts Page"))
  );
}

function Page_Reports() {
  const reports = van.state([]);
  const reportElement = div();

  async function getReports() {
    try {
      const data = await useFetch("/api/report");
      reports.val = data; // Update state to trigger re-render
      console.log(data);

      for(let item of data){
        van.add(reportElement,div(
          { class: "report-item" },
          div(
            { class: "report-header" },
            label(item.title),
            span(
              button(
                { onclick: () => console.log(`Mark Done: ${item.id}`) },
                `Done: ${item.isdone ? "True" : "False"}`
              ),
              button(
                { onclick: () => console.log(`Close: ${item.id}`) },
                `Close: ${item.isclose ? "True" : "False"}`
              )
            )
          ),
          div({ class: "report-content" }, item.content)
        ));
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  }

  // Call getReports when component mounts
  getReports();

  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div(
      { class: "main-content" },
      label("Reports Page"),
      El_CreateReportForm(),
      reportElement,
    )
  );
}

function Page_Tickets() {
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, label("Tickets Page"))
  );
}

function Page_Database() {
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, label("Database Page"))
  );
}

function Page_Settings() {
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, label("Settings Page"))
  );
}

function Page_Backup() {


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

export {
  Page_Admin,
  Page_Logs,
  Page_Accounts,
  Page_Tickets,
  Page_Reports,
  Page_Database,
  Page_Settings,
  Page_Backup
}