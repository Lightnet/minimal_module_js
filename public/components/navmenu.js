/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
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
    let data_theme = themeIDState.val || "light";
    return data_theme === "light" ? "fa-sun" : "fa-moon";
  });

  return div({class:"sidebar"},
    div({class:"sidebar-item",onclick:()=>clickToggleTheme(),title:"Toggle Theme"},
      i({class:()=>`fas ${theme_css.val}`},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/"),title:"Home"},
      i({class:"fas fa-home"},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/about"),title:"About"},
      i({class:"fas fa-circle-info"},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signin"),title:"Sign In"},
      i({class:"fas fa-right-to-bracket"},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signup"),title:"Sign Up"},
      i({class:"fas fa-user-plus"},''),
    ),
    div({class:"sidebar-item",onclick:()=>navigate("/signup"),title:"Recovery"},
      i({class:"fas fa-key"},''),
    ),
  );
}

const AccessNavMenu=()=>{
  const theme_css = van.derive(() => {
    let data_theme = themeIDState.val || "light";
    return data_theme === "light" ? "fa-sun" : "fa-moon";
  });

  return div({class:"sidebar"},
    div({class:"sidebar-item",onclick:()=>clickToggleTheme(),title:"Toggle Theme"},
      i({class:()=>`fas ${theme_css.val}`},''),
    ),
    div({class:"sidebar-item",title:"Home",onclick:()=>navigate("/")},
      i({class:"fas fa-home"},''),
    ),
    div({class:"sidebar-item",title:"blog",onclick:()=>navigate("/blog")},
      i({class:"fas fa-blog"},''),
    ),
    div({class:"sidebar-item",title:"Account",onclick:()=>navigate("/account")},
      i({class:"fas fa-user"},''),
    ),
    div({class:"sidebar-item",title:"Message",onclick:()=>navigate("/message")},
      i({class:"fas fa-envelope"},''),
    ),
    div({class:"sidebar-item",title:"Forum",onclick:()=>navigate("/forum")},
      i({class:"fas fa-comments"},''),
    ),
    div({class:"sidebar-item",title:"Report",onclick:()=>navigate("/report")},
      i({class:"fas fa-flag"},''),
    ),
    div({class:"sidebar-item",title:"Help",onclick:()=>navigate("/help")},
      i({class:"fas fa-circle-question"},''),
    ),
    div({class:"sidebar-item",title:"Settings",onclick:()=>navigate("/settings")},
      i({class:"fas fa-cog"},''),
    ),
    div({class:"sidebar-item",title:"Sign Out",onclick:()=>navigate("/signout")},
      i({class:"fas fa-sign-out"},''),
    ),
    div({class:"sidebar-item",title:"test",onclick:()=>navigate("/test")},
      i({class:"fas fa-flask"},''),
    ),
  );
}

export{
  HomeNavMenu,
  AccessNavMenu
}