/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {button, h1, div, pre, p, br} = van.tags

function Page_About() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  // return div(
  //   HomeNavMenu(),
  //   p("About"), 
  //   p("Work in progress builds."), 
  // );

  return div({id:"home" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Header"),
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