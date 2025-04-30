/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterPathname,getRouterQuery , getRouterParams, navigate } from "vanjs-routing";
import {forumIDState} from "/components/context.js";
import useFetch from "../../libs/useFetch.js";
import { displayButtonCreateBoard, getForumIDBoards } from "./bb_board.js";
import { HomeNavMenu } from "../navmenu.js";
import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";

const {button, i, input, label,textarea, link, div, span, h2, p} = van.tags;

// get forums
const getForumsEL = () => {

  const forumList = div({class:"forum-container"});
  const isEditModal = van.state(false);
  const isDeleteModal = van.state(false);

  function editForum(id,title,content){
    console.log("editForum:",id);
    isEditModal.val = false;
    van.add(document.body, Modal({closed:isEditModal},editForumForm({
      closed:isEditModal,
      id:id,
      title:title,
      content:content
    })));
  }

  function deleteForum(id,title,content){
    console.log("deleteForum:",id);
    isDeleteModal.val = false;
    van.add(document.body, Modal({closed:isDeleteModal},deleteForumForm({
      closed:isDeleteModal,
      id:id,
      title:title,
      content:content
    })));
  }

  function enterForum(id){
    console.log("Forum ID HERE?: ",id);
    forumIDState.val = id;
    navigate('/forum?id='+id);
  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      //console.log(data);
      if(data){
        for(let ii=0; ii < data.length;ii++){
          van.add(forumList, div({id:data[ii].id, class:'forum-item'},
              div({class:'forum-header'},
                div({class:"forum-title"},
                  h2({onclick:()=>enterForum(data[ii].id)},`[ Forum ] ${data[ii].title}`),
                ),
                div({class:"action-buttons"},
                  button({class:"edit-btn",onclick:()=>editForum(data[ii].id, data[ii].title, data[ii].content)},
                    i({class:"fa-solid fa-pen-to-square"}),
                    label(' Edit'),
                  ),
                  button({class:"delete-btn",onclick:()=>deleteForum(data[ii].id, data[ii].title, data[ii].content)},
                    i({class:"fa-solid fa-trash"}),
                    label(' Delete')
                  ),
                ),
              ),
              div({class:'forum-content',onclick:()=>enterForum(data[ii].id)},
                data[ii].content
              ),
            ),
          );
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  getForums();

  // return div(forumList);
  return forumList;
 
}
//BUTTON MODAL
function displayButtonCreateForum(){
  const isCreated = van.state(false);
  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createFormForum({closed:isCreated})
    ));
  }

  return button({class:"nav-button", onclick:()=>btnCreateForum()},"Create Forum");
}
// CREATE FORUM
function createFormForum({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch('/api/forum',{
        method:'POST',
        body:JSON.stringify({
          title:forumTitle.val,
          content:forumContent.val,
        })
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "CREATED"){
          notify({
            color:Color.success,
            content:"Create Forum!"
          });
          closed.val = true;
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Forum!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Forum!"
        });
      }
      // if(closed){
      //   closed.val = true;
      // }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Forum Fail!"
      });
    }
  }

  return div({id:'forumForm',class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Title:"),
      input({placeholder:"Enter forum title", type:"text",value:forumTitle, oninput:e=>forumTitle.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:""},'Content:'),
      textarea({placeholder:"Enter forum description", value:forumContent, oninput:e=>forumContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnCreateForum},'Create'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// EDIT FORUM
function editForumForm({closed,id,title,content}){

  console.log(id);
  const forumId = van.state(id);
  const forumTitle = van.state(title);
  const forumContent = van.state(content);

  async function btnUpdateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/forum/${forumId.val}`,{
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
            content:"Update Forum!"
          });

          let content = document.getElementById(forumId.val);
          // console.log(content);
          // console.log(content.children[0].children[0].children[0]);
          let elTitle = content.children[0].children[0].children[0]
          elTitle.textContent = `[ Forum ] ${forumTitle.val}`;
          let elContent = content.children[1]
          // console.log(elContent);
          elContent.textContent = forumContent.val
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Forum!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Forum!"
        });
      }
      if(closed){
        closed.val = true;
      }
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
      label({for:"forumID"},"ID:"),
      label({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Title:"),
      input({placeholder:"Enter forum title", type:"text",value:forumTitle, oninput:e=>forumTitle.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:""},'Description:'),
      textarea({placeholder:"Enter forum description", value:forumContent, oninput:e=>forumContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnUpdateForum},'Update'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// DELETE FORUM
function deleteForumForm({closed,id,title,content}){

  console.log(id);
  const forumId = van.state(id);
  const forumTitle = van.state(title);
  const forumContent = van.state(content);

  async function btnDeleteForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/forum/${forumId.val}`,{
        method:'DELETE'
      });
      console.log(data);
      if(data){
        console.log(">>>");
        if(data?.api == "DELETE"){
          notify({
            color:Color.success,
            content:"Delete Forum!"
          });
          // closed.val = true;
          let ccontent = document.getElementById(forumId.val);
          if(ccontent.parentNode){
            ccontent.parentNode.removeChild(ccontent);
          }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Forum!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Forum!"
        });
      }
      if(closed){
        closed.val = true;
      }
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
      label({for:"forumTitle"},"ID:"),
      p({},forumId.val)
    ),
    div({class:"modal-form-group"},
      label({for:"forumTitle"},"Title:"),
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
// DEFAULT GET PULBIC FORUMS
// GET CURRENT FORUM IS PUBLIC
function pageForum() {

  // console.log("getRouterPathname()",getRouterPathname())
  // console.log("getRouterParams()",getRouterParams())
  // console.log("getRouterQuery()",getRouterQuery())
  const { id } = getRouterQuery();
  console.log("forum id:", id)
  if(id){
    const boardEl = div({id:"BOARDS",class:""});
    const bbForumNav = div({id:'nav',class:"nav-container"});
    console.log("XXX FORUM ID:", id);
    if(id){
      getForumIDBoards(boardEl, id);
    }
    //nav menu
    // while (bbForumNav.lastElementChild) { // clear children
    //   bbForumNav.removeChild(bbForumNav.lastElementChild);
    // }
    van.add(bbForumNav,
      button({class:"nav-button",onclick:()=>navigate('/forum')}, "Forum"),
    );
    van.add(bbForumNav,
      displayButtonCreateBoard()
    );

    return div({id:"forum",class:"forum-container" },
      HomeNavMenu(),
      div({class:"main-content"},
        bbForumNav,
        div({class:"forum-main"},
          boardEl
        )
      ),
    );
  }else{
    const bbForumNav = div({id:'nav',class:"nav-container"});
    //nav menus
    // while (bbForumNav.lastElementChild) { // clear children
    //   bbForumNav.removeChild(bbForumNav.lastElementChild);
    // }
    van.add(bbForumNav,
      displayButtonCreateForum(),
    );

    return div({id:"forum",class:"forum-container" },
      HomeNavMenu(),
      div({class:"main-content"},
        bbForumNav,
        div({class:"forum-main"},
          getForumsEL()
        )
      ),
    );
  }

}
// GET CURRENT FORUM ID for boards
function pageForumIDboards() {
  // console.log("FORUM ID???");
  const boardEl = div({id:"BOARDS",class:""});
  const bbForumNav = div({id:'nav',class:"nav-container"});

  //get forums
  // van.derive(() => {
  // });

  console.log("getRouterPathname()",getRouterPathname())
  console.log("getRouterParams()",getRouterParams())
  console.log("getRouterQuery()",getRouterQuery())

  const { id } = getRouterParams();  
  console.log("XXX FORUM ID:", id);
  if(id){
    getForumIDBoards(boardEl, id);
  }

  //nav menu
  while (bbForumNav.lastElementChild) { // clear children
    bbForumNav.removeChild(bbForumNav.lastElementChild);
  }
  van.add(bbForumNav,
    button({class:"nav-button",onclick:()=>navigate('/forum')}, "Forum"),
  );
  van.add(bbForumNav,
    displayButtonCreateBoard()
  );

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbPostTypeEL,
      bbForumNav,
      div({class:"forum-main"},
        boardEl
      )
    ),
  );

}

export {
  getForumsEL,
  pageForum,
  pageForumIDboards,
  displayButtonCreateForum,
  createFormForum,
}