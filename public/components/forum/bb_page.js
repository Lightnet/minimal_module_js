/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import useFetch from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate, getRouterQuery, getRouterPathname } from "vanjs-routing";
import { aliasState, boardIDState, topicIDState, commentIDState } from "/components/context.js";

import { baseLayout } from "./base_layout.js";
import { displayButtonCreateForum, getForumsEL, pageForumID } from "./bb_forum.js";
import { displayButtonCreateBoard, getForumIDBoards, pageBoard } from "./bb_board.js";
import { displayButtonCreateTopic, pageTopic} from "./bb_topic.js";
import { displayButtonCreateComment, pageComment} from "./bb_comment.js";
import { HomeNavMenu } from "../navmenu.js";

const { button, div, i, link } = van.tags;

// DEFAULT GET PULBIC FORUMS
// GET CURRENT FORUM IS PUBLIC
function pageForum() {
  console.log("init style");

  const bbForumNav = div();

  van.derive(()=>{
    let path = getRouterPathname();

    // if(path.startsWith("/forum")){
    //   // console.log("FOUND forum...");
    //   return displayButtonCreateForum();
    // }

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

  // Setup style
  // if(!document.getElementById("forum_style")){
  //   van.add(document.head, link({
  //     id:"forum_style",
  //     rel:"stylesheet",
  //     type:"text/css",
  //     href:"/components/forum/forum.css"
  //   }))
  // }
  // render base layout and forum list
  // return baseLayout({children:getForumsEL()});

  return div({id:"home",class:"forum-container" },
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