/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import useFetch from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { aliasState, boardIDState, topicIDState, commentIDState } from "/components/context.js";

import { baseLayout } from "./base_layout.js";
import { displayButtonCreateForum, getForumsEL, pageForumID } from "./bb_forum.js";
import { getForumIDBoards, pageBoard } from "./bb_board.js";
import { pageTopic} from "./bb_topic.js";
import { pageComment} from "./bb_comment.js";


const { div, link } = van.tags;

// DEFAULT GET PULBIC FORUMS
// GET CURRENT FORUM IS PUBLIC
function pageForum() {
  console.log("init style");
  // Setup style
  if(!document.getElementById("forum_style")){
    van.add(document.head, link({
      id:"forum_style",
      rel:"stylesheet",
      type:"text/css",
      href:"/components/forum/forum.css"
    }))
  }
  // render base layout and forum list
  return baseLayout({children:getForumsEL()});
}

export{
  pageForumID,
  pageForum,
  pageBoard,
  pageTopic,
  pageComment,
}