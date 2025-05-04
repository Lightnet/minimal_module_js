/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { AdminNavMenus, Header } from "./admin_layout.js";
import { SignInEL } from "../auth/signin.js";

const { div } = van.tags;

export default function pageAdminSignIn(){
  //return pageForumPermissions();

  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, 
      SignInEL()
    )
  );

}
