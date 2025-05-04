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

  async function getReports() {
    try {
      const data = await useFetch("/api/report");
      reports.val = data; // Update state to trigger re-render
      console.log(data);

      for(let item of data){
        van.add(reportElement,tr({class:""},
          td(item.id),
          td(item.user_id),
          td(item.title),
          td(
            button({ onclick: () => console.log(`Mark Done: ${item.id}`) },
              `Done: ${item.isdone ? "True" : "False"}`
            )
          ),
          td(
            button({ onclick: () => console.log(`Close: ${item.id}`) },
              `Close: ${item.isclose ? "True" : "False"}`
            )
          ),
          td(item.create_at),
          td({},
            button("Delete")
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
              td("ID"),
              td("User ID"),
              td("Title"),
              td("Done"),
              td("Close"),
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