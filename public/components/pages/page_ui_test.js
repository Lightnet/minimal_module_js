/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { HomeNavMenu } from "../navmenu.js";
import { NotifyTest } from "../notify/notifytest.js";
const {button, input, h1, label, div} = van.tags;

function Page_UI_Test(){

  // return NotifyTest();

  return div({id:"settings" },
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Test Area"),
      ),
      div({class:"ccontent"},
        label('Notify Test'),
        div(
          NotifyTest()
        ),
        
      ),
    ),
  );

}

export {
  Page_UI_Test,
}