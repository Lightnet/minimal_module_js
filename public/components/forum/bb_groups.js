/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { HomeNavMenu } from "../navmenu.js";
import { btnCreateGroup, renderFormGroupMembership, renderGroupMembership, renderGroups } from "../groups/index.js";
const { div} = van.tags;

export function pageForumGroups() {

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbForumNav,
      div({class:"forum-main"},
        btnCreateGroup(),
        renderGroups(),
        renderFormGroupMembership(),
        renderGroupMembership(),
      )
    ),
  );
}