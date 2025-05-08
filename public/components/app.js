/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
// import van from "vanjs-core";
// const {button, div, pre, p} = van.tags

import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from "/libs/useFetch.js";
import { aliasState, loginState, roleState } from "/components/context.js";

import { pageHome } from "./pages/page_home.js";
import { pageForgot, pageSignIn, pageSignOut, pageSignUp } from "./pages/page_auth.js";
import { pageAbout } from "./pages/page_about.js";
import { pageReport } from "./pages/page_report.js";
import { pageBookIdContent, pageBook, pageBooks } from "./book/book.js";
import { pageAccount } from "./pages/page_account.js";
import { pageMessage } from "./messages/page_message.js";
import { pageSetting } from "./pages/page_settings.js";
import { pageForum, pageBoard, pageTopic, pageComment } from "./forum/bb_page.js";
import { checkTheme } from "./theme/theme.js";
import { pageHelp } from "./pages/page_help.js";
import { Page_UI_Test } from "./pages/page_ui_test.js";
import { pageForumPermissions } from "./forum/bb_permission.js";
import { pageForumGroups } from "./forum/bb_groups.js";
import { pageBlog } from "./pages/page_blog.js";


const App = () => {

  checkTheme();

  async function login_check(){
    let data = await useFetch('/api/auth/user');
    // console.log('DATA: ', data);
    if(data){
      if(data.api){
        if(data.api == 'PASS'){
          //console.log("[[ data.alias: ", data.alias);
          aliasState.val = data.alias
          roleState.val = data.role;
          loginState.val = true;
        }else{
          loginState.val = false;
        }
      }
    }
  }

  login_check();

  return Router({id:"route",
    //basename: "/", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: pageHome },
      { path: "/about", component: pageAbout },
      { path: "/account", component: pageAccount },
      { path: "/signin", component: pageSignIn },
      { path: "/signup", component: pageSignUp },
      { path: "/signout", component: pageSignOut },
      { path: "/forgot", component: pageForgot },
      { path: "/settings", component: pageSetting },
      { path: "/message", component: pageMessage },
      { path: "/forum", component: pageForum },
      { path: "/board", component: pageBoard },
      { path: "/topic", component: pageTopic },
      { path: "/permissions", component: pageForumPermissions },
      { path: "/groups", component: pageForumGroups },
      { path: "/report", component: pageReport },
      { path: "/help", component: pageHelp },
      { path: "/test", component: Page_UI_Test },
      { path: "/blog", component: pageBlog },
      { path: "/books", component: pageBooks },
      { path: "/book/:bookid/page/:page", component: pageBook },
      { path: "/book/:bookid/content", component: pageBookIdContent },
    ]
  });
}

export{
  App
}

export default App;