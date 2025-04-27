/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button,i, div, label} = van.tags;

import { aliasState, loginState } from "/components/context.js";
import { clickToggleTheme, toggleTheme } from "./theme/theme.js";
import { themeIDState } from "./context.js";

const HomeNavMenu=()=>{
  const draw_access = van.derive(()=>{
    //console.log(loginState.val);
    //return loginState.val;
    if(loginState.val){
      return AccessNavMenu();
    }else{
      return BaseNavMenu();
    }
  });

  return draw_access;
}

const BaseNavMenu=()=>{

  const theme_css = van.derive(() => {
    // let data_theme = localStorage.getItem("data-theme") || "light";
    let data_theme = themeIDState.val || "light";
    // console.log("data_theme: AAA ", data_theme);
    // return data_theme;
    return data_theme === "light" ? "fa-sun" : "fa-moon";
  });

  return div({class:"sidebar"}, 
    div({class:"sidebar-item",onclick:()=>navigate("/"),title:"Home"},
      i({class:"fas fa-home"},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/about"),title:"About"},
      i({class:"fas fa-circle-info"},''),
      //button({onclick:()=>navigate("/about")},'About'),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signin"),title:"Sign In"},
      i({class:"fas fa-right-to-bracket"},''),
      // button({onclick:()=>navigate("/signin")},'Sign In'),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signup"),title:"Sign Up"},
      i({class:"fas fa-user-plus"},''),
      // button({onclick:()=>navigate("/signup")},'Sign Up'),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signup"),title:"Recovery"},
      i({class:"fas fa-key"},''),
      // button({onclick:()=>navigate("/signup")},'Sign Up'),
    ),
    div({class:"sidebar-item",onclick:()=>clickToggleTheme(),title:"Toggle Theme"},
      // toggleTheme()
      // i({class:()=>`fas ${theme_css}`,onclick:()=>clickToggleTheme()},''),
      // i({class:()=>theme_css.val},'T'),
      i({class:()=>`fas ${theme_css.val}`},''),
    ),
  );
}

const AccessNavMenu=()=>{
  return div({class:"sidebar"},
    div({class:"sidebar-item"},
      i({class:"fas fa-home",onclick:()=>navigate("/")},''),
      // button({class:"fas fa-home",onclick:()=>navigate("/")},'Home'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-user",onclick:()=>navigate("/account")},''),
      // button({class:"fas fa-user",onclick:()=>navigate("/account")},'Account'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-envelope",onclick:()=>navigate("/message")},''),
      // button({class:"fas fa-envelope",onclick:()=>navigate("/message")},'Message'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-comments",onclick:()=>navigate("/forum")},''),
      // button({class:"fas fa-comments",onclick:()=>navigate("/forum")},'Forum'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-flag",onclick:()=>navigate("/report")},''),
      // button({class:"fas fa-flag",onclick:()=>navigate("/report")},'Report'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-cog",onclick:()=>navigate("/settings")},''),
      // button({class:"fas fa-cog",onclick:()=>navigate("/settings")},'Settings'),
    ),
    div({class:"sidebar-item"},
      i({class:"fas fa-sign-out",onclick:()=>navigate("/signout")},''),
      // button({class:"fas fa-home",onclick:()=>navigate("/signout")},'Sign Out'),
    ),
    div({class:"sidebar-item"},
      toggleTheme()
    ),
  );
}

export{
  HomeNavMenu,
  AccessNavMenu
}