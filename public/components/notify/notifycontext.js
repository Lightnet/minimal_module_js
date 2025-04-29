/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Theme variables for light and dark modes
import van from "vanjs-core";

export const Color = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

const timeToDelete = 300;
const timeToClose = 1000 * 10;

const notifies = van.state([]);
const objNotify = van.state(null);

export {
  notifies,
  objNotify,
  timeToDelete,
  timeToClose
}
