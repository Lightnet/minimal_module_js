/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { HomeNavMenu } from "../navmenu.js";
import { btnCreateFormPermission, renderPermissionTable } from "../permissions/index.js";
const {button, i, input, label,textarea, link, div, span, h2, h3, p, form, select, option, table, tbody, thead, tr, th, td  } = van.tags;

export function pageForumPermissions() {

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbForumNav,
      div({class:"forum-main"},
        btnCreateFormPermission(),
        renderPermissionTable(),
      )
    ),
  );

}