
import van from "vanjs-core";
import { Router, Link, getRouterParams,getRouterPathname, navigate } from "vanjs-routing";
import { toggleTheme } from "../theme/theme.js";
import { displayButtonCreateForum } from "./bb_forum.js";
import { displayButtonCreateBoard } from "./bb_board.js";
import { displayButtonCreateTopic } from "./bb_topic.js";
import { displayButtonCreateComment } from "./bb_comment.js";

const { div, button, label, style, link } = van.tags;

// BASE FORUM PAGE
const baseLayout = ({ children }) => {
  // console.log("getRouterParams() ",getRouterParams());
  // console.log("getRouterPathname() ",getRouterPathname());

  const bbPostTypeEL = van.derive(()=>{
    let path = getRouterPathname();
    if(path.startsWith("/topic/")){
      // console.log("FOUND TOPIC...");
      return displayButtonCreateComment();
    }

    if(path.startsWith("/board/")){
      // console.log("FOUND board...");
      return displayButtonCreateTopic();
    }

    if(path.startsWith("/forum/message")){
      // console.log("FOUND forum...");
      return;
    }

    if(path.startsWith("/forum/")){
      // console.log("FOUND forum...");
      return displayButtonCreateBoard();
    }

    if(path.startsWith("/forum")){
      // console.log("FOUND forum...");
      return displayButtonCreateForum();
    }

  })

  return div({class:"forum-container"},
    div({class:"nav-container"},
      forumNavMenu()
    ),
    bbPostTypeEL,
    div({class:"forum-main"},
      children
    )
  );
};

function forumNavMenu(){

  return div(
    {class: "nav-container"},
    button({class: "nav-button", onclick: ()=>navigate("/")},"Back"),
    button({class: "nav-button", onclick: ()=>navigate("/forum")},"Forum"),
    button({class: "nav-button", onclick: ()=>navigate("/forum/message")},"Message"),
    button({class: "nav-button", onclick: ()=>navigate("/forum/settings")},"Settings"),
    toggleTheme()
  );

}

export {
  baseLayout,
  forumNavMenu
}