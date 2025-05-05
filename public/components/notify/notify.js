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
  // console.log(props);
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
    // console.log("CLOSE");
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
    // console.log(`slide > ${slide}`);
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
  // Create a ref for the div
  let id="notify";

  const checkAndUpdateZIndex = () => {
    // Get the div by its id
    const alertDiv = document.getElementById(id);
    if (!alertDiv) {
      // console.log("Div with id 'alert' not found.");
      return;
    }

    // Get the current z-index
    const currentZIndex = window.getComputedStyle(alertDiv).zIndex;
    const currentZ = currentZIndex === "auto" ? 0 : parseInt(currentZIndex);
    // console.log(`Current z-index of alert div: ${currentZ}`);

    // Find the highest z-index among all divs
    const allElements = document.querySelectorAll("div");
    let maxZIndex = currentZ;
    allElements.forEach((el) => {
      if (el !== alertDiv) {
        const otherZIndex = window.getComputedStyle(el).zIndex;
        const otherZ = otherZIndex === "auto" ? 0 : parseInt(otherZIndex);
        if (otherZ > maxZIndex) {
          maxZIndex = otherZ;
        }
      }
    });

    // Check if the alert div is on top
    const isTop = currentZ >= maxZIndex;
    // console.log(`Is alert div on top? ${isTop}`);

    // If not on top, update z-index to be higher than the max
    if (!isTop) {
      const newZIndex = maxZIndex + 1;
      alertDiv.style.zIndex = newZIndex;
      // console.log(`Updated z-index to ${newZIndex} to bring alert div to top.`);
    }
  };

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
    checkAndUpdateZIndex();
  });

  //html top right
  return div({id:id,style:"position:fixed;top:4px;right:4px;overflow:hidden;z-index:10;"},
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

