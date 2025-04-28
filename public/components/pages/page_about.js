/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {button, h1, div, pre, p, br} = van.tags

function Page_About() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div({id:"about" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("About"),
      ),
      div({class:"ccontent"},
        p("About"), 
        p("Work in progress builds."), 
      ),
    ),
  );
}

export{
  Page_About
}