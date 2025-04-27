/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";
import { AccountEL } from "../account/profile.js";

const {button, h1, div, pre, p} = van.tags

function AccountPage() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

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