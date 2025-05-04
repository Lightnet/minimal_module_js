/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
// import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";
import { aliasState, roleState } from "../context.js";

const {button, h1, div, label} = van.tags;

function Page_Home() {

  const username = van.derive(()=>aliasState.val);

  const role = van.derive(()=>{
    console.log("roleState.val:", roleState.val);
    return roleState.val
  });


  return div({id:"home" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Home"),
      ),
      div({class:"ccontent"},
        label("[Home]"), 
        label("User: ", username),
        label("Role: ", role),
      ),
    ),
  );
}

export{
  Page_Home
}