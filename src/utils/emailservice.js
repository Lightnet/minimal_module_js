/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// Hypothetical email service

export function sendEmail({to,subject,body}){
  console.log("to:", to);
  console.log("subject:", subject);
  console.log("body:", body);
}