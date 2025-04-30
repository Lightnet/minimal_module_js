/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Theme variables for light and dark modes
import van from "vanjs-core";
import { animToClose, objNotify, timeToClose, timeToDelete } from "./notifycontext.js";

const {button, div, span, i} = van.tags;

// render notify alert html
function NotifyContainer(props){
  console.log(props);
  const fade = van.state(true);
  const nColor = van.state(props.color || 'info');
  const ID = van.state(props.id);
  const isClose = van.state(false);
  const autoClose = props.autoClose || true;
  let timeoutId;
  let fadeId;

  if (autoClose) {
    timeoutId = setTimeout(() => onClose(), timeToClose);
    fadeId = setTimeout(() => callFade(), animToClose);
  }

  // Close div element after animation completes
  function onClose() {
    clearTimeout(timeoutId);
    clearTimeout(fadeId);
    callFade(); // Trigger slideOut animation
    // Delay DOM removal until animation completes
    setTimeout(() => {
      isClose.val = true; // Remove from DOM
    }, timeToDelete); // 600ms to match slideOut duration
  }
  // user close
  function clickClose() {
    console.log("CLOSE");
    clearTimeout(timeoutId);
    clearTimeout(fadeId);
    onClose();
  }

  //fade animation
  function callFade(){
    fade.val=false;
  }

  //for css check for change in nColor and fade animation
  const cssRender = van.derive(() => {
    let slide = fade.val ? "slideIn" : "slideOut";
    console.log(`slide > ${slide}`);
    return `notification ${nColor.val} ${slide}`
  });

  //check if close, render notify alert and close button
  return ()=> isClose.val ? null : div({id:ID,
    class:'notification-wrapper'
  },
    div({class: cssRender.val },
      span({ 
        class: "notification-content" 
      },props.children),
      // button({class:"button",onclick:clickClose}," X ")
      // <i class="fa-solid fa-square-xmark"></i>
      // <i class="fa-solid fa-circle-xmark"></i>
      button({class:"button",onclick:clickClose},
        i({class:"fa-solid fa-circle-xmark"})
      )
    )
  )
}
// add top html element for handle notify
const NotifyManager = ()=>{
  // html element
  const notifiesDiv = div();
  //detect for objNotify changes
  van.derive(() => {
    let newNotify = objNotify.val;
    // console.log("New: ", newNotify);
    //if null ingore it
    if(newNotify){
      let newNotifyContainer = NotifyContainer(newNotify);
      //append notify html to notify message as render html
      van.add(notifiesDiv, newNotifyContainer);
    }
  });

  //html top right
  return div({style:"position:fixed;top:4px;right:4px;overflow:hidden;"},
    notifiesDiv
  )
}
//sent notify args it will detect change on van.derive from NotifyManager
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

