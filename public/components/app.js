/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from "/libs/useFetch.js";

import {
  aliasState,
  loginState
} from "/components/context.js";

import { Page_Home } from "./pages/page_home.js";
import { ForgotPage, SignInPage, SignOutPage, SignUpPage } from "./pages/page_auth.js";
import { Page_About } from "./pages/page_about.js";
//import { BlogPage } from "./pages/page_blog.js";
// import { Page_Report } from "./pages/page_report.js";
// import { Page_Novel } from "./novel/novel.js";
import { AccountPage } from "./pages/page_account.js";
import { Page_Message } from "./messages/page_message.js";
import { Page_Setting } from "./pages/page_settings.js";
import { pageForumID, pageForum, pageBoard, pageTopic, pageComment } from "./forum/bb_page.js";
import { checkTheme } from "./theme/theme.js";
const {button, div, pre, p} = van.tags
//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {

  checkTheme();

  async function login_check(){
    let data = await useFetch('/api/auth/user');
    //console.log('DATA: ', data);
    if(data){
      if(data.api){
        if(data.api == 'PASS'){
          //console.log("[[ data.alias: ", data.alias)
          aliasState.val = data.alias
          loginState.val = true;
        }else{
          loginState.val = false;
        }
      }
    }
  }

  login_check();

  return Router({
    //basename: "/", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: Page_Home },
      { path: "/about", component: Page_About },
      { path: "/account", component: AccountPage },
      { path: "/signin", component: SignInPage },
      { path: "/signup", component: SignUpPage },
      { path: "/signout", component: SignOutPage },
      { path: "/forgot", component: ForgotPage },
      { path: "/settings", component: Page_Setting },
      { path: "/message", component: Page_Message },
      { path: "/forum", component: pageForum },
      { path: "/forum/:id", component: pageForumID },
      { path: "/board/:id", component: pageBoard },
      { path: "/topic/:id", component: pageTopic },
      // { path: "/report", component: Page_Report },
      //{ path: "/help", component: HelpPage },
      //{ path: "/help/:section", component: HelpPage },
      // { path: "/novel", component: Page_Novel },
    ]
  });
}

export{
  App
}

export default App;