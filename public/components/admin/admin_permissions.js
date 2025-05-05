/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/
import van from "vanjs-core";
import { AdminNavMenus, Header } from "./admin_layout.js";
import { btnCreateFormPermission, renderPermissionTable } from "../permissions/index.js";

const {button, div} = van.tags;

export default function pageAdminPermissions(){

  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({class: "admin-content" }, 
      btnCreateFormPermission(),
      renderPermissionTable(),
    )
  );
}
