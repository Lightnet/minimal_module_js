/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "/libs/useFetch.js";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";

const {button, h1, div, label, input, textarea,
  table,
  thead,
  tbody,
  tr,
  td
} = van.tags;

function pageMessage(){

  const messageTable = tbody({id:"messageTable"});

  async function fetchDeleteMessage(id){
    try {
      const data = await useFetch(`/api/message/${id}`,{
        method:'DELETE'
      });
      console.log("data message: ",data);
      notify({
        color:Color.success,
        content:`Message Delete:${id}`
      });

      const messageItem = document.getElementById(id);

      if(messageItem){
        messageItem.parentNode.removeChild(messageItem);
      }

    } catch (error) {
      console.log(error.message);
      notify({
        color:Color.warn,
        content: error.message
      });
    }
  }

  async function btnDeleteMessageId(id){
    const isCreated = van.state(false);
    van.add(document.body, Modal({closed:isCreated},
      div(
        label(`Are you sure to Delete ID:${id} ?`)
      ),
      div(
        button({class:"warn",onclick:()=>{
          fetchDeleteMessage(id);
          isCreated.val=true;
        }},"DELETE"),
        button({onclick:()=>isCreated.val=true},"Cancel"),
      )
      
    ));
    //await fetchDeleteMessage(id);
  }

  async function fetchMessages() {
    try {
      const data = await useFetch('/api/message');
      console.log(data)
      if(data){
        for(const item of data){
          console.log(item);
          van.add(messageTable,
            tr({id:item.id},
              td(`${item.id}`), // id
              td(`${item.to_username}`), // from
              td(`${item.subject}`), // subject
              td(`${item.create_at}`), // date
              td(
                button({class:"warn",onclick:()=>btnDeleteMessageId(item.id)},"Delete")
              ),
            )
          )
        }
      }

    } catch (error) {
      console.log("Error: ",error.message);
    }
  }

  fetchMessages();

  return div({id:"message"},
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Message"),
      ),
      div({class:"ccontent"},
        label('Message'),
        createFormMessage(),
        table(
          thead(
            tr(
              td(`ID:`),
              td(`From:`),
              td(`Subject:`),
              td(`create_at:`),
              td(`Actions:`),
            )
          ),
          messageTable,
        ),
      ),
    ),
  );

}

//BUTTON MODAL
function createFormMessage(){
  
  function btnFormCreateMessage(){
    const isCreated = van.state(false);
    van.add(document.body, Modal({closed:isCreated},
      createMessageForm({closed:isCreated})
    ));
  }
  return button({onclick:()=>btnFormCreateMessage()},"Create Message");
}

// CREATE REPORT FORUM
function createMessageForm({closed}){

  const toAlias = van.state('test');
  const subject = van.state('test subject');
  const content = van.state('test content');

  async function btnCreateForum(){
    // console.log("create message form");
    console.log("toAlias.val: ", toAlias.val);
    console.log("subject.val: ", subject.val);
    console.log("content.val: ", content.val);
    try{
      const data = await useFetch('/api/message',{
        method:'POST',
        body:JSON.stringify({
          alias: toAlias.val,
          subject: subject.val,
          content: content.val,
        })
      });
      console.log(data);
      if(typeof closed === 'object'){
        closed.val = true;
      }
      notify({
        color:Color.success,
        content:"Message Sent!"
      })
    }catch(error){
      console.log("ERROR",error)
      notify({
        color:Color.warn,
        content:error.message
      });
    }
  }

  return div({id:'pm',class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"To Alias:"),
      input({type:"text",value:toAlias, oninput:e=>toAlias.val=e.target.value}),
    ),
    div({class:"form-group"},
      label({class:"report-title"},"Subject:"),
      td(input({type:"text",value:subject, oninput:e=>subject.val=e.target.value})),
    ),
    div({class:"form-group"},
      label({class:"report-content"},"Content:"),
      textarea({style:"width:100%; height:200px;",value:content, oninput:e=>content.val=e.target.value})
    ),
    div({class:"form-group"},
      button({class:"normal", onclick:btnCreateForum},'Send'),
      button({class:"warn", onclick:()=>closed.val=true},'Cancel'),
    ),
  );
}

export {
  pageMessage
}