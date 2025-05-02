/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams,getRouterPathname, navigate } from "vanjs-routing";
import { toggleTheme } from "../theme/theme.js";
import { boardIDState, commentIDState, forumIDState, topicIDState } from "../context.js";

const { div, button, label, style, link } = van.tags;

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

function debugIds(){
  van.derive(()=>{
    console.log("[forumIDState]: ",forumIDState.val);
    console.log("[boardIDState]: ",boardIDState.val);
    console.log("[topicIDState]: ",topicIDState.val);
    console.log("[commentIDState]: ",commentIDState.val);
  })

  return div();
}

function navForum(){
  forumIDState.val = null;
  navigate('/forum');
}

function getQueryId(defaultValue = null) {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || defaultValue;
}

export {
  forumNavMenu,
  debugIds,
  getQueryId,
  navForum
}