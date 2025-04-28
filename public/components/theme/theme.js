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

  const isLight = van.derive(()=>{
    if(themeIDState.val == 'light'){
      //console.log("Hello?", 'light?');
      return 'light';
    }else{
      //console.log("Hello?", 'dark?');
      return 'dark';
    }
  })

  const textTheme =  van.derive(()=>{
    if(themeIDState.val == 'light'){
      //console.log("Hello?", 'light?');
      return 'Theme: Light';
    }else{
      //console.log("Hello?", 'dark?');
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
  // console.log("data-theme", document.body.getAttribute("data-theme"));
  const data_theme = localStorage.getItem("data-theme");
  if(data_theme){
    document.body.setAttribute("data-theme", data_theme);
    // console.log("data-theme", document.body.getAttribute("data-theme"));
  }
}

const UIStyle = style(`
:root {
  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;
}

[data-theme='dark'] {
  --cheader-color:#333333;
  --ccontent-color:#666666;
  --cbody-color:#1a1a1a;
  --cfont-color:#d9d9d9;
}

[data-theme='light'] {
  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;
}

.cheader{
  background-color: var(--cheader-color);
}

.ccontent{
  background-color: var(--ccontent-color);
}

body{
  background-color: var(--cbody-color);
  color:var(--cfont-color);
}
`);

export {
  UIStyle
}