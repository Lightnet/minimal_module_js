/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Theme variables for light and dark modes
import van from "vanjs-core";

// from css
export const Color = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};
// timer predfine
const timeToDelete = 600;
const timeToClose = 1000 * 10;
const animToClose = 1000 * 9;

const objNotify = van.state(null);

export {
  objNotify,
  timeToDelete,
  timeToClose,
  animToClose
}
