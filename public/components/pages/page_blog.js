/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
// import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { BlogEL } from "../blog/blogpost.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, h1, div} = van.tags

function pageBlog() {

  return div({id:"blog" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Blog"),
      ),
      div({class:"ccontent"},
        BlogEL(),
      ),
    ),
  );

}

export{
  pageBlog
}