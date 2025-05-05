/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
// import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { El_CreateReportForm } from "../report/report.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, h1, pre, p, br} = van.tags

function pageReport() {

  return div({id:"report" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Report"),
      ),
      div({class:"ccontent"},
        El_CreateReportForm(),
      ),
    ),
  );
}

export{
  pageReport
}