/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { HomeNavMenu } from "../navmenu.js";

const {button, input, h1, label, div, table, tbody, tr, td} = van.tags;

const Page_Setting = () => {

  return div({id:"settings" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Settings"),
      ),
      div({class:"ccontent"},
        label('Settings'),
        div(
          label('Theme Color?'),
        ),
        div(
          label('Cookie?'),
        ),
        div(
          label('Admin/Mod?'),
        ),
      ),
    ),
  );


}

export {
  Page_Setting
}