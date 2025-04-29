/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Theme variables for light and dark modes
import van from "vanjs-core";
import { themeIDState } from "../context.js";

const {button,style} = van.tags;

export function toggleTheme(){
  // const themeState = van.state('light');
  //check if local storage theme exist
  const data_theme = localStorage.getItem("data-theme");
  if(data_theme){
    themeIDState.val = data_theme
  }

  function ctoggleTheme(){
    console.log("themeIDState.val",themeIDState.val)
    if(themeIDState.val == 'light'){
      themeIDState.val = 'dark';
    }else{
      themeIDState.val = 'light';
    }
    //set theme
    localStorage.setItem("data-theme", themeIDState.val);
    document.body.setAttribute("data-theme", themeIDState.val);
  }

  const textTheme =  van.derive(()=>{
    if(themeIDState.val == 'light'){
      return 'Theme: Light';
    }else{
      return 'Theme: Dark';
    }
  });

  return button({class:"nav-button",onclick:ctoggleTheme},textTheme)
}

export function clickToggleTheme(){
  
  let data_theme = localStorage.getItem("data-theme");
  console.log("data_theme: ",data_theme);
  if(data_theme == 'light'){
    data_theme = 'dark';
    themeIDState.val = 'dark';
  }else{
    data_theme = 'light';
    themeIDState.val = 'light';
  }
  //set theme
  localStorage.setItem("data-theme", data_theme);
  document.body.setAttribute("data-theme", data_theme);
}

export function checkTheme(){
  // document.body.setAttribute("data-theme", themeState.val);
  const data_theme = localStorage.getItem("data-theme");
  if(data_theme){
    document.body.setAttribute("data-theme", data_theme);
  }
  // console.log("data-theme", document.body.getAttribute("data-theme"));
}

