/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// import { van } from "/dps.js";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import useFetch from "/libs/useFetch.js";
const {button, div, label, select, option, textarea, input} = van.tags;

//BUTTON MODAL
function El_CreateReportForm(){

  const isCreated = van.state(false);
  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createReportForm({closed:isCreated})
    ));
  }

  return button({class:"normal",onclick:()=>btnCreateForum()},"Create Report");
}

// CREATE REPORT FORUM
function createReportForm({closed}){

  const formTitle = van.state('test');
  const formType = van.state('user');
  const formContent = van.state('test');

  async function btnCreateForum(){
    console.log("create report form");
    console.log(formTitle.val);
    console.log(formType.val);
    console.log(formContent.val);
    try{
      const data = await useFetch('/api/report',{
        method:'POST',
        body:JSON.stringify({
          title:formTitle.val,
          type:formType.val,
          content:formContent.val,
        })
      });
      console.log(data);
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e)
    }
  }

  return div({id:'createReportForm', class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Title:"),
      input({value:formTitle,oninput: e => formTitle.val = e.target.value, type:"text",placeholder:"Enter Report Title"}),
    ),
    div({class:"form-group"},
      label({class:"report-type"},"Submit Type:"),
      select({value:formType,oninput: e => formType.val = e.target.value,},
        option({},"User"),
        option({},"Bugs"),
        option({},"Feedback"),
      )
    ),
    div({class:"form-group"},
      label({class:"report-content"},"Content:"),
      textarea({value:formContent,oninput: e => formContent.val = e.target.value,placeholder:"Enter report details"}),
    ),

    div({class:"form-group"},
      button({class:"normal",onclick:btnCreateForum},'Create'),
      button({class:"warn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

export {
  El_CreateReportForm
}