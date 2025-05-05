/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { SignInEL } from "../auth/signin.js";
import { SignUpEL } from "../auth/signup.js";
import SignOutEL from "../auth/signout.js";
import { ForgotEL } from "../auth/forgot.js";

const { div } = van.tags;

function pageSignIn(){
  return div(
    SignInEL()
  );
}

function pageSignUp(){
  return div(
    SignUpEL()
  )
}

function pageSignOut(){
  return div(
    SignOutEL()
  )
}

function pageForgot(){
  return div(
    ForgotEL()
  )
}

export {
  pageSignIn,
  pageSignUp,
  pageSignOut,
  pageForgot,
}