/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
// import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";
import { AccountEL } from "../account/profile.js";

const {button, h1, div, pre, p} = van.tags

function AccountPage() {

  return div({id:"account" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Account"),
      ),
      div({class:"ccontent"},
        AccountEL(),
      ),
    ),
  );

}

export{
  AccountPage
}