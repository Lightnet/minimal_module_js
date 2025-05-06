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

//BUTTON CREATE REPORT WITH PARAMS
export function btnCreateReportForm(type, id){
  return button({class:"normal",onclick:()=>createReportForm(type, id, false)},"Create Report");
}

export function createReportForm(type, id, isDisable=true){
  const isCreated = van.state(false);
  van.add(document.body, Modal({closed:isCreated},
    createReportFormParams({closed:isCreated,type:type,id:id,isDisable:isDisable})
  ));
}

function createReportFormParams({closed, type, id, isDisable}){

  const formTitle = van.state('test');
  const formReason = van.state('test');
  const formResourceType = van.state(type || '');
  const formResourceId = van.state(id || '');
  const _isDisable = van.state(isDisable || false);
  //render set correctly
  setTimeout(()=>{
    formResourceType.val = type || '';
    document.getElementById('resourcetype').value = type || ''
    console.log(formResourceType.val);
  },1);
  
  async function btnCreateForum(){
    console.log("create report form");
    console.log(formTitle.val);
    console.log(formReason.val);
    console.log(formResourceType.val);
    console.log(formResourceId.val);
    try{
      const data = await useFetch('/api/report',{
        method:'POST',
        body:JSON.stringify({
          title:formTitle.val,
          reason:formReason.val,
          resource_type:formResourceType.val,
          resource_id:formResourceId.val,
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
      label({class:"report-type"},"Type:"),
      select({
        id:"resourcetype",
        value:formResourceType,
        oninput: e => formResourceType.val = e.target.value,
        disabled:_isDisable.val
      },
        option({value:"forum"},"Forum"),
        option({value:"board"},"Board"),
        option({value:"topic"},"Topic"),
        option({value:"comment"},"Comment"),
        option({value:"message"},"Message"),
      )
    ),
    div({class:"form-group"},
      label({class:"report-type"},"Type ID:"),
      input({type:"number",value:formResourceId,oninput: e => formResourceId.val = e.target.value,disabled:_isDisable.val})
    ),
    div({class:"form-group"},
      label({class:"report-content"},"Reason:"),
      textarea({value:formReason,oninput: e => formReason.val = e.target.value,placeholder:"Enter report details"}),
    ),

    div({class:"form-group"},
      button({class:"normal",onclick:btnCreateForum},'Create'),
      button({class:"warn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

