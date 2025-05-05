/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { pageForumGroups } from "../forum/bb_groups.js";
import { AdminNavMenus, Header } from "./admin_layout.js";

const {button, div, span, label,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

export default function pageAdminGroups(){
  // return pageForumGroups();

  return div({ class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "admin-content" }, 
      pageForumGroups()
    )
  );
}
