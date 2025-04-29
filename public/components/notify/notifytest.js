/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/
import van from "vanjs-core";
import { notify } from "./notify.js";
import { Color } from "./notifycontext.js";

const {button, style, div, span} = van.tags;

// test for button ui notify alert
function NotifyTest(){

  function btnInfo(){
    notify({
      color:Color.info,
      content:"Test Info"
    })
  }

  function btnSuccess(){
    notify({
      color:Color.success,
      content:"Test success"
    })
  }

  function btnError(){
    notify({
      color:Color.error,
      content:"Test error"
    })
  }

  function btnWarn(){
    notify({
      color:Color.warn,
      content:"Test warn"
    })
  }

  function btnWarn2(){
    notify({
      color:Color.warn,
      content:"Test warn  sdfs df sdf sdf sd sd s sd fsd"
    })
  }

  return div(
    button({onclick:btnInfo},'Test Info'),
    button({onclick:btnSuccess},'Test Success'),
    button({onclick:btnError},'Test Error'),
    button({onclick:btnWarn},'Test Warn'),
    button({onclick:btnWarn2},'Test Warn 2'),
  )

}

export {
  NotifyTest
}