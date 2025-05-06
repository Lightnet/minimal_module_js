/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { Router, Link,getRouterPathname, getRouterParams,getRouterQuery, navigate } from "vanjs-routing";
import { displayButtonCreateComment, getTopicIDComments } from "./bb_comment.js";
import { aliasState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { HomeNavMenu } from "../navmenu.js";
import { topicContentState, topicTitleState } from "../context.js";
import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { getQueryId } from "./base_layout.js";
import { createReportForm } from "../report/report.js";

const {button, input, textarea, i, p, link, label, h2, div} = van.tags;
// BUTTON CREATE TOPIC
function displayButtonCreateTopic(){

  const isCreated = van.state(false);

  function btnCreateTopic(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createFormTopic({closed:isCreated})
    ));
  }

  return button({class:"nav-button",onclick:()=>btnCreateTopic()},"Create Topic");
}
// CREATE TOPIC
function createFormTopic({closed}){

  const topicTitle = van.state('test');
  const topicContent = van.state('test');

  async function btnCreateTopic(){
    // console.log("create Topic");
    try{
      const data = await useFetch('/api/topic',{
        method:'POST',
        body:JSON.stringify({
          parentid:boardIDState.val,
          title:topicTitle.val,
          content:topicContent.val,
        })
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "CREATE"){
          notify({
            color:Color.success,
            content:"Create Topic!"
          });
          closed.val = true;
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Create!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Topic!"
        });
      }


      // if(closed){
      //   closed.val = true;
      // }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Topic Fail!"
      });
    }
  }

  return div({id:'topicForm',class:"ccontent"},
    div({class:"modal-form-group"},
      label({class:"report-title"},"Topic Title:"),
      input({type:"text",value:topicTitle, oninput:e=>topicTitle.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:"report-content"},'Content:'),
      textarea({value:topicContent, oninput:e=>topicContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnCreateTopic},'Create'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// EDIT FORUM
function editFormTopic({closed,id,title,content}){

  // console.log(id);
  const forumId = van.state(id);
  const forumTitle = van.state(title);
  const forumContent = van.state(content);

  async function btnUpdateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/topic/${forumId.val}`,{
        method:'PUT',
        body:JSON.stringify({
          id:forumId.val,
          title:forumTitle.val,
          content:forumContent.val,
        })
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "UPDATE"){
          notify({
            color:Color.success,
            content:"Update Topic!"
          });

          let content = document.getElementById(forumId.val);
          // console.log(content);
          // console.log(content.children[0].children[0].children[0]);
          let elTitle = content.children[0].children[0].children[0]
          elTitle.textContent = `[Topic] ${forumTitle.val}`;
          let elContent = content.children[1]
          // console.log(elContent);
          elContent.textContent = '[Content] '+forumContent.val
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Topic!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Topic!"
        });
      }
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Topic Fail!"
      });
    }
  }

  return div({id:'formTopic',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"forumID"},"Topic ID:"),
      label({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Title:"),
      input({placeholder:"Enter forum title", type:"text",value:forumTitle, oninput:e=>forumTitle.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:""},'Content:'),
      textarea({placeholder:"Enter forum content", value:forumContent, oninput:e=>forumContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnUpdateForum},'Update'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// DELETE FORUM
function deleteFormTopic({closed,id,title,content}){

  console.log(id);
  const forumId = van.state(id);
  const forumTitle = van.state(title);
  const forumContent = van.state(content);

  async function btnDeleteForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/topic/${forumId.val}`,{
        method:'DELETE'
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "DELETE"){
          notify({
            color:Color.success,
            content:"Delete Topic!"
          });
          // closed.val = true;
          let ccontent = document.getElementById(forumId.val);
          if(ccontent.parentNode){
            ccontent.parentNode.removeChild(ccontent);
          }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Topic!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Topic!"
        });
      }
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Topic Fail!"
      });
    }
  }

  return div({id:'forumForm',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Topic ID:"),
      p({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Title:"),
      p({},forumTitle.val)
    ),
    div({class:"modal-form-group"},
      label({class:""},'Content:'),
      p({},forumContent.val)
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"warn",onclick:btnDeleteForum},'Delete'),
      button({type:"submit",class:"normal",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// PAGE TOPIC ID
// This get comments
function pageTopic() {

  const topicEl = div({class:"comment-list"});
  const bbforumNav = div({class:"nav-container"});

  // console.log("Page_Topic getRouterParams >> ",getRouterParams()); 
  // const { id } = getRouterQuery();

  // console.log("getRouterPathname: ",getRouterPathname())
  let q = getRouterQuery();
  console.log("q:", q)
  // console.log("getRouterQuery: ",getRouterQuery())
  // console.log("getRouterParams: ",getRouterParams())

  let id = getQueryId();
  if(!id){
    id = topicIDState.val;
  }

  if(id){
    // topicIDState.val = id;
    // while (topicEl.lastElementChild) {// clear children
    //   topicEl.removeChild(topicEl.lastElementChild);
    // }

    van.add(topicEl,div({id:id, class:'topic-item'},
      div({class:'topic-header'},
        div({class:"topic-title"},
          h2("[Topic] "+ topicTitleState.val),
        ),
        div({class:"action-buttons"},
          button({class:"edit-btn"},
            i({class:"fa-solid fa-pen-to-square"}),
            label(' Edit')
          ),
          button({class:"delete-btn"},
            i({class:"fa-solid fa-trash"}),
            label(' Delete')
          ),
          button({class:"delete-btn"},
            i({class:"fa-solid fa-trash"}),
            label(' Report')
          ),
        )
      ),
      // div({class:"topic-content"},label(" [ Content ] "+ topicContentState.val))
      div({class:"topic-content"},div(topicContentState.val))
    )),
    getTopicIDComments(topicEl, id);
  }

  function NavFormTopic(_url){
    console.log("URL: ",_url);
    navigate(_url);
  }
  // http://localhost:3000/board/4
  // http://localhost:3000/board/4

  function navForum(){
    forumIDState.val = null;
    navigate('/forum');
  }

  // nav menu
  // while (bbforumNav.lastElementChild) {// clear children
  //   bbforumNav.removeChild(bbforumNav.lastElementChild);
  // }
  van.add(bbforumNav,
    button({class:"nav-button",onclick:()=>navForum()},"Forums"),
  );
  van.add(bbforumNav,
    button({class:"nav-button",onclick:()=>NavFormTopic('/forum?id='+forumIDState.val)},"Boards"),
  );
  van.add(bbforumNav,
    button({class:"nav-button",onclick:()=>NavFormTopic('/board?id='+boardIDState.val)},"Topics"),
  );
  van.add(bbforumNav,
    displayButtonCreateComment(),
  );

  return div({class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbPostTypeEL,
      bbforumNav,
      div({class:"forum-main"},
        topicEl
      )
    ),
  );

}
// BOARD get topics
export async function getBoardIDTopics(topicEl,_id){

  const isEditModal = van.state(false);
  const isDeleteModal = van.state(false);

  function getTopicID(_id, _title, _content){
    // topicIDState.val = _id;
    console.log("TOPIC: ", _id);
    topicIDState.val = _id;
    topicTitleState.val = _title;
    topicContentState.val = _content;
    navigate('/topic?id='+_id);
  }

  function editTopic(id,title,content){
    console.log("edit topic:",id);
    isEditModal.val = false;
    van.add(document.body, Modal({closed:isEditModal},editFormTopic({
      closed:isEditModal,
      id:id,
      title:title,
      content:content
    })));
  }
  
  function deleteTopic(id,title,content){
    console.log("delete topic:",id);
    isDeleteModal.val = false;
    van.add(document.body, Modal({closed:isDeleteModal},deleteFormTopic({
      closed:isDeleteModal,
      id:id,
      title:title,
      content:content
    })));
  }

  // get board data
  // create board element
  // container
  // - title
  // - content
  try{
    console.log("BOARD ID: HERE?", _id);
    const data = await useFetch(`/api/topics/${_id}`);
    console.log(data);
    if(data){
      for(let item of data){
        // console.log("item: ", item);
        // BOARD CONTENT
        van.add(topicEl, div({id:item.id, class:'topic-item'},
          div({class:'topic-header'},
            div({class:"topic-title",onclick:()=>getTopicID(item.id, item.title, item.content)},
              h2("[Topic] "+ item.title),
            ),
            div({class:"action-buttons"},
              button({class:"edit-btn", onclick:()=>editTopic(item.id,item.title,item.content)},
                i({class:"fa-solid fa-pen-to-square"}),
                label(' Edit')
              ),
              button({class:"report-btn",onclick:()=>deleteTopic(item.id,item.title,item.content)},
                i({class:"fa-solid fa-trash"}),
                label(' Delete')
              ),
              button({class:"report-btn", onclick:()=>createReportForm('topic',item.id)},
                i({class:"fa-solid fa-flag"}),
                label(' Report')
              ),
            )
          ),
          // div({class:"topic-content",onclick:()=>getTopicID(item.id, item.title, item.content)},label(" [ Content ] "+ item.content),)
          div({class:"topic-content",onclick:()=>getTopicID(item.id, item.title, item.content)},
            div(item.content)
          )
        ));
      }
    }
  }catch(e){
    console.log(e);
  }
}

export {
  displayButtonCreateTopic,
  pageTopic
}