import van from "vanjs-core";
import { Modal } from "vanjs-ui";

import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "../../libs/useFetch.js";


export function pageForumGroups() {


  function renderForm(){
    return div({class:"form-container"},

    );
  }

  function renderGroupsTable(){
    return div({class:"form-container"},
      
    );
  }

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbForumNav,
      div({class:"forum-main"},
        renderForm(),
        renderGroupsTable(),
      )
    ),
  );
}