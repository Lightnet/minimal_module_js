/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { AdminNavMenus, Header } from "./admin_layout.js";
import SignOutEL from "../auth/signout.js";

const { div } = van.tags;

export default function pageAdminSignOut(){
  //return pageForumPermissions();

  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "admin-content" }, 
      SignOutEL('/admin')
    )
  );

}
