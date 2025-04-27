/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE, ECS, van } from "/dps.js";
import { toggleTheme } from "../theme/theme.js";
//import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from '/libs/useFetch.js';
import { El_CreateReportForm } from "../report/report.js";
const {button, div, span, label} = van.tags;

// Mock dependencies (replace with actual imports)
// const El_CreateReportForm = () => van.tags.div("Report Form Placeholder");
// const useFetch = async (url) => {
//   // Mock API response
//   return [
//     { id: 1, title: "Report 1", content: "Content 1", isdone: false, isclose: false },
//     { id: 2, title: "Report 2", content: "Content 2", isdone: true, isclose: false },
//   ];
// };

function AdminNavMenus() {
  return div(
    { class: "sidebar active" },
    div(
      toggleTheme(),
      button({ onclick: () => navigate("/admin") }, "Home"),
      button({ onclick: () => navigate("/admin/logs") }, "Logs"),
      button({ onclick: () => navigate("/admin/reports") }, "Reports"),
      button({onclick:()=>navigate('/admin/accounts')},'Accounts'),
      button({onclick:()=>navigate('/admin/tickets')},'Tickets'),
      button({onclick:()=>navigate('/admin/database')},'Database'),
      button({onclick:()=>navigate('/admin/settings')},'Settings'),
      
    )
  );
}

function Header() {
  const isSidebarActive = van.state(true);

  function toggleSidebar() {
    console.log("Toggle...")
    isSidebarActive.val = !isSidebarActive.val;
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      if (isSidebarActive.val) {
        sidebar.classList.add("active");
      } else {
        sidebar.classList.remove("active");
      }
    }
  }

  return div(
    { class: "header" },
    button({ class: "toggle-btn", onclick: toggleSidebar }, "☰"),
    div({ class: "logo" }, "Admin Panel"),
    div({ class: "user-profile" }, "User")
  );
}

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
  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, label("Logs Page"))
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
}