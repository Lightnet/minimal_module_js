/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { Router, Link, getRouterParams, getRouterQuery, navigate } from "vanjs-routing";
import { displayButtonCreateTopic, getBoardIDTopics } from "./bb_topic.js";
import { aliasState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { HomeNavMenu } from "../navmenu.js";
import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { getQueryId } from "./base_layout.js";

const {button, i, textarea, link, input, label, p, div, h2} = van.tags;
// BUTTON CREATE BOARD
function displayButtonCreateBoard(){

  const isCreated = van.state(false);

  function btnCreateBoard(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createFormBoard({closed:isCreated})
    ));
  }

  return button({class:"nav-button",onclick:()=>btnCreateBoard()},"Create Board");
}
// CREATE BOARD
function createFormBoard({closed}){

  const boardName = van.state('test');
  const boardDescription = van.state('test');

  async function btnCreateBoard(){
    // console.log("create board");
    try{
      const data = await useFetch('/api/board',{
        method:'POST',
        body:JSON.stringify({
          parentid:forumIDState.val,
          name:boardName.val,
          description:boardDescription.val,
          moderator_group_id:1
        })
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
        if(data?.api == "CREATE"){
          notify({
            color:Color.success,
            content:"Create Board!"
          });
          closed.val = true;
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Board!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Board!"
        });
      }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Board Fail!"
      });
    }
  }

  return div({id:'boardForm',class:"ccontent"},
    div({class:"modal-form-group"},
      label({class:"report-title"},"Board Name:"),
      input({type:"text",value:boardName, oninput:e=>boardName.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:"report-content"},'Description:'),
      textarea({value:boardDescription, oninput:e=>boardDescription.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnCreateBoard},'Create'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// EDIT FORUM
function editFormBoard({closed,id,title,content}){

  // console.log(id);
  const forumId = van.state(id);
  const boardName = van.state(title);
  const boardDescription = van.state(content);

  async function btnUpdateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/board/${forumId.val}`,{
        method:'PUT',
        body:JSON.stringify({
          id:forumId.val,
          name:boardName.val,
          description:boardDescription.val,
        })
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
        if(data?.api == "UPDATE"){
          notify({
            color:Color.success,
            content:"Update Board!"
          });

          let content = document.getElementById(forumId.val);
          let elTitle = content.children[0].children[0].children[0]
          elTitle.textContent = `[Board] ${boardName.val}`;
          let elContent = content.children[1]
          elContent.textContent = '[Description] '+boardDescription.val
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Board!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Board!"
        });
      }
      // if(closed){
        closed.val = true;
      // }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Forum Fail!"
      });
    }
  }

  return div({id:'forumForm',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"forumID"},"Board ID:"),
      label({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Name:"),
      input({placeholder:"Enter Board Name", type:"text",value:boardName, oninput:e=>boardName.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:""},'Description:'),
      textarea({placeholder:"Enter Board description", value:boardDescription, oninput:e=>boardDescription.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnUpdateForum},'Update'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// DELETE FORUM
function deleteForumBoard({closed,id,title,content}){

  console.log(id);
  const forumId = van.state(id);
  const forumTitle = van.state(title);
  const forumContent = van.state(content);

  async function btnDeleteForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/board/${forumId.val}`,{
        method:'DELETE'
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "DELETE"){
          notify({
            color:Color.success,
            content:"Delete Board!"
          });
          // closed.val = true;
          let ccontent = document.getElementById(forumId.val);
          if(ccontent.parentNode){
            ccontent.parentNode.removeChild(ccontent);
          }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Board!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Board!"
        });
      }
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Board Fail!"
      });
    }
  }

  return div({id:'forumForm',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Board ID:"),
      p({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Name:"),
      p({},forumTitle.val)
    ),
    div({class:"modal-form-group"},
      label({class:""},'Description:'),
      p({},forumContent.val)
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"warn",onclick:btnDeleteForum},'Delete'),
      button({type:"submit",class:"normal",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// PAGE BOARD
function pageBoard() {

  const topicEl = div({id:'topics'});
  const bbforumNav = div({class:"nav-container"});
  // while (topicEl.lastElementChild) {// clear children
  //   topicEl.removeChild(topicEl.lastElementChild);
  // }

  let id = getQueryId();
  if(!id){
    id = boardIDState.val;
  }
  if(id){
    console.log("BOARD ID:", id);
    getBoardIDTopics(topicEl, id);
  }

  function navForum(){
    forumIDState.val = null;
    navigate('/forum');
  }

  // while (bbforumNav.lastElementChild) {// clear children
  //   bbforumNav.removeChild(bbforumNav.lastElementChild);
  // }
  van.add(bbforumNav,
    button({class:"nav-button",onclick:()=>navForum()},"Forums"),
  );
  van.add(bbforumNav,
    button({class:"nav-button",onclick:()=>navigate('/forum?id='+forumIDState.val)},"Boards"),
  );
  van.add(bbforumNav,
    displayButtonCreateTopic()
  );

  return div({class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      bbforumNav,
      div({class:"forum-main"},
        topicEl
      )
    ),
  );

}
// GET FORUM FOR BOARDS
export async function getForumIDBoards(isClosed,boardEl, _id){

  const isEditModal = van.state(false);
  const isDeleteModal = van.state(false);

  function getBoardID(_id){
    console.log("Board ID", _id);
    boardIDState.val = _id;
    isClosed.val = true;
    navigate('/board?id='+_id);
  }

  function editBoard(id,title,content){
    console.log("editForum:",id);
    isEditModal.val = false;
    van.add(document.body, Modal({closed:isEditModal},editFormBoard({
      closed:isEditModal,
      id:id,
      title:title,
      content:content
    })));
  }

  function deleteBoard(id,title,content){
    console.log("deleteForum:",id);
    isDeleteModal.val = false;
    van.add(document.body, Modal({closed:isDeleteModal},deleteForumBoard({
      closed:isDeleteModal,
      id:id,
      title:title,
      content:content
    })));
  }

  try{
    const data = await useFetch(`/api/boards/${_id}`);
    console.log("get FORUM Boards:", data);
    if(data){
      for(let item of data){
        // console.log("item: ", item);
        // div container
        // div title (alight left)   Edit, Delete(align right)
        // div content

        van.add(boardEl, div({id:item.id,class:"board-container"},
          div({class:'board-header'},
            div({class:"board-title"},
              h2({onclick:()=>getBoardID(item.id)},`[Board] ${item.name}`), 
            ),
            div({class:"action-buttons"},
              button({class:"edit-btn",onclick:()=>editBoard(item.id,item.name,item.description)},
                i({class:"fa-solid fa-pen-to-square"}),
                label(" Edit")
              ),
              button({class:"delete-btn",onclick:()=>deleteBoard(item.id,item.name,item.description)},
                i({class:"fa-solid fa-trash"}),
                label(" Delete")
              ),
            )
          ),
          p({class:"board-description",onclick:()=>getBoardID(item.id)},label(" [Description] "+ item.description),)
        ));
      }
    }
  }catch(e){
    console.log("ERROR",e)
  }
}

export {
  displayButtonCreateBoard,
  pageBoard
}