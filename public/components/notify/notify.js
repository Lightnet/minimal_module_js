/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Theme variables for light and dark modes
import van from "vanjs-core";
import { notifies, objNotify, timeToClose } from "./notifycontext.js";

const {button, style, div, span} = van.tags;

function NotifyContainer(props){
  console.log(props);
  const fade = van.state(true);
  const nColor = van.state(props.color || 'info');
  const ID = van.state(props.id);
  const isClose = van.state(false);
  const autoClose = props.autoClose || true;
  let timeoutId;

  if (autoClose) {
    timeoutId = setTimeout(() => onClose(), timeToClose);
  }

  function onClose(){
     document.getElementById(ID);
     isClose.val = true;
     clearTimeout(timeoutId);
  }

  function clickClose(){
    // onClose();
    timeoutId = setTimeout(() => onClose(true), timeToClose);
  }

  function callFade(){

  }

  return ()=> isClose.val ? null : div({id:ID,class:``},
    span(
      props.children,
      span({class:"float:left;"},
        button({onclick:clickClose}," X ")
      )
    ),
  )
}

const NotifyManager = ()=>{
  const notifiesDiv = div();
  van.derive(() => {
    let newNotify = objNotify.val;
    console.log("New: ", newNotify);
    if(newNotify){
      let newNotifyContainer = NotifyContainer(newNotify);
      van.add(notifiesDiv, newNotifyContainer);
    }
  });

  return div({style:"position:fixed;top:4px;right:4px;overflow:hidden;"},
    notifiesDiv
  )
}

function notify(args){
  let color = args.color || "info";
  let content = args.content || "None";
  let autoClose = args.autoClose || true;
  const obNote={
    id:crypto.randomUUID(),
    color:color,
    children:content,
    autoClose:autoClose
  }
  objNotify.val = obNote;

}

export {
  NotifyContainer,
  NotifyManager,
  notify,
}

