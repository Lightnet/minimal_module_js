/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";
import {aliasState} from "/components/context.js";
//import { button_test } from "../tests/buttonname.js";

const {button, h1, div, label} = van.tags;

function Page_Home() {

  const username = van.derive(()=>{
    //console.log("user change name:", aliasState.val);
    return aliasState.val
  });

  return div({id:"home" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Header"),
      ),
      div({class:"ccontent"},
        label("[Home]"), 
        label("User: ", username),
      ),
    ),
  );
}

export{
  Page_Home
}