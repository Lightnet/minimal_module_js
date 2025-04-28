/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, h1, pre, p} = van.tags

function HelpPage() {
  van.derive(() => {
    console.log(getRouterParams()); // { section: "profile" }
  });

  // return div(
  //   p("Help"),
  //   Link({ href: "/" }, "Back to Home"),
  //   button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)")
  // );

  return div({id:"help" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Help"),
      ),
      div({class:"ccontent"},
        button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)"),
      ),
    ),
  );

}

export{
  HelpPage
}