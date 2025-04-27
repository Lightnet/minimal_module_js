/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "/libs/useFetch.js";

const {button, h1, div, label, table, tbody, tr, td, input, textarea} = van.tags;

function Page_Message(){

  return div({id:"message"},
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Message"),
      ),
      div({class:"ccontent"},
        label('Message'),
        El_CreateMessageForm()
      ),
    ),
  );

}

//BUTTON MODAL
function El_CreateMessageForm(){

  const isCreated = van.state(false);

  function btnMessageForm(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createMessageForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnMessageForm()},"Create Message");
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
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e)
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
  Page_Message,
  El_CreateMessageForm,
}