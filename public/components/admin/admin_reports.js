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
import { El_CreateReportForm } from "../report/report.js";

const {button, div, span, label,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

function pageReports() {
  const reports = van.state([]);
  const reportElement = tbody();

  async function cfetchDeleteReport(id){
    try {
      const data = await useFetch(`/api/report/${id}`,{
        method:'DELETE'
      });
      console.log("data: ",data)
    } catch (error) {
      console.log("error:", error.message);
    }
  }

  async function cUserIdBan(id){
    console.log("ID:", id)
  }

  async function cCheckUserId(id){
    console.log("ID:", id)
  }

  async function getReports() {
    try {
      const data = await useFetch("/api/report");
      reports.val = data; // Update state to trigger re-render
      console.log(data);

      for(let item of data){
        van.add(reportElement,tr({id:item.id},
          td(item.reporter_id),
          td(item.resource_type),
          td(item.resource_id),
          td(item.title),
          td(item.reason),
          td(item.created_at),
          td({},
            button({onclick:()=>cfetchDeleteReport(item.id)},"Delete"),
            button({onclick:()=>cCheckUserId(item.id)},"Check"),
          )
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
    div({ class: "main-content" },
      div(
        label("Reports Page"),
      ),
      div(
        El_CreateReportForm(),
        table(
          thead(
            tr(
              td("User ID"),
              td("Resource Type"),
              td("Resource Id"),
              td("User ID"),
              td("Reason"),
              td("Created"),
              td("Actions"),
            )
          ),
          reportElement,
        ),
      )
    )
  );
}

export default pageReports;