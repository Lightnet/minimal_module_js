/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/
import van from "vanjs-core";
import { pageForumPermissions } from "../forum/bb_permission.js";
import { AdminNavMenus, Header } from "./admin_layout.js";

const {button, div, span, label,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

export default function pageAdminPermissions(){
  //return pageForumPermissions();

  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "main-content" }, 
      pageForumPermissions()
    )
  );

}
