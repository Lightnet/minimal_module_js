/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
// import { baseLayout } from "./base_layout.js";
import { displayButtonCreateForum, getForumsEL, pageForumID } from "./bb_forum.js";
import { pageBoard } from "./bb_board.js";
import { pageTopic} from "./bb_topic.js";
import { pageComment} from "./bb_comment.js";
import { HomeNavMenu } from "../navmenu.js";

const { button, div } = van.tags;

// DEFAULT GET PULBIC FORUMS
// GET CURRENT FORUM IS PUBLIC
function pageForum() {
  console.log("init style");

  const bbForumNav = div({id:'nav',class:"nav-container"});

  van.derive(()=>{

    while (bbForumNav.lastElementChild) { // clear children
      bbForumNav.removeChild(bbForumNav.lastElementChild);
    }

    van.add(bbForumNav,
      displayButtonCreateForum(),
    );

    van.add(bbForumNav,
      button('test')
    );

  });

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      bbForumNav,
      div({class:"forum-main"},
        getForumsEL()
      )
    ),
  );
}

export{
  pageForumID,
  pageForum,
  pageBoard,
  pageTopic,
  pageComment,
}