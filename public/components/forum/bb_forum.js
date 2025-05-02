/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// name
// description
// forumName
// forumDescription
// Name
// Description
// 
// topicTitle
// topicContent


import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterPathname,getRouterQuery , getRouterParams, navigate } from "vanjs-routing";
import { forumIDState } from "/components/context.js";
import useFetch from "../../libs/useFetch.js";
import { displayButtonCreateBoard, getForumIDBoards } from "./bb_board.js";
import { HomeNavMenu } from "../navmenu.js";
import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";

const {button, i, input, label,textarea, link, div, span, h2, p} = van.tags;

function getQueryId(defaultValue = null) {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || defaultValue;
}

// get forums
const getForums = (isClosed) => {

  const forumList = div({class:"forum-container"});
  const isEditModal = van.state(false);
  const isDeleteModal = van.state(false);

  function editForum(id,name,description){
    console.log("editForum:",id);
    isEditModal.val = false;
    van.add(document.body, Modal({closed:isEditModal},editFormForum({
      closed:isEditModal,
      id:id,
      name:name,
      description:description
    })));
  }

  function deleteForum(id,name,description){
    console.log("deleteForum:",id);
    isDeleteModal.val = false;
    van.add(document.body, Modal({closed:isDeleteModal},deleteFormForum({
      closed:isDeleteModal,
      id:id,
      name:name,
      description:description
    })));
  }

  function enterForum(id){
    console.log("Forum ID HERE?: ",id);
    forumIDState.val = id;
    isClosed.val = true;
    navigate(`/forum?id=${id}`);
  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      //console.log(data);
      if(data){
        for(let item of data){
          van.add(forumList, div({id:item.id, class:'forum-item'},
              div({class:'forum-header'},
                div({class:"forum-title"},
                  h2({onclick:()=>enterForum(item.id)},`[ Forum ] ${item.name}`),
                ),
                div({class:"action-buttons"},
                  button({class:"edit-btn",onclick:()=>editForum(item.id, item.name, item.description)},
                    i({class:"fa-solid fa-pen-to-square"}),
                    label(' Edit'),
                  ),
                  button({class:"delete-btn",onclick:()=>deleteForum(item.id, item.name, item.description)},
                    i({class:"fa-solid fa-trash"}),
                    label(' Delete')
                  ),
                ),
              ),
              div({class:'forum-content',onclick:()=>enterForum(item.id)},
                item.description
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
          name:forumTitle.val,
          description:forumContent.val,
          moderator_group_id:1,
        })
      });
      console.log(data);
      if(data){
        // console.log(">>>");
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
function editFormForum({closed,id,name,description}){

  console.log(id);
  const forumId = van.state(id);
  const forumName = van.state(name);
  const forumDescription = van.state(description);

  async function btnUpdateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/forum/${forumId.val}`,{
        method:'PUT',
        body:JSON.stringify({
          id:forumId.val,
          name:forumName.val,
          description:forumDescription.val,
          moderator_group_id:1,
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
          let elName = content.children[0].children[0].children[0]
          elName.textContent = `[Forum] ${forumName.val}`;
          let elDescription = content.children[1]
          elDescription.textContent = forumDescription.val
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
      input({placeholder:"Enter forum title", type:"text",value:forumName, oninput:e=>forumName.val=e.target.value})
    ),
    div({class:"modal-form-group"},
      label({class:""},'Description:'),
      textarea({placeholder:"Enter forum description", value:forumDescription, oninput:e=>forumDescription.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnUpdateForum},'Update'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// DELETE FORUM
function deleteFormForum({closed,id,name,description}){

  // console.log(id);
  const forumId = van.state(id);
  const forumName = van.state(name);
  const forumDescription = van.state(description);

  async function btnDeleteForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/forum/${forumId.val}`,{
        method:'DELETE'
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
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
      p({},forumName.val)
    ),
    div({class:"modal-form-group"},
      label({class:""},'Description:'),
      p({},forumDescription.val)
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"warn",onclick:btnDeleteForum},'Delete'),
      button({type:"submit",class:"normal",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
function navForum(){
  forumIDState.val = null;
  navigate('/forum');
}
// DEFAULT GET PULBIC FORUMS
// GET CURRENT FORUM IS PUBLIC
//need clean up html
function pageForum() {
  const isClose = van.state(false);

  const bbForumNav = div({id:'nav',class:"nav-container"});
  console.log("getRouterPathname()",getRouterPathname())
  console.log("getRouterParams()",getRouterParams())
  console.log("getRouterQuery()",getRouterQuery())
  
  let id = getQueryId();
  //const { id } = getRouterQuery();
  if(!id){
    id = forumIDState.val;  
  }
  console.log("forum id:", id)
  if(id){
    console.log("FOUND ID");
    const boardEl = div({id:"BOARDS",class:""});
    
    console.log("XXX FORUM ID:", id);
    
    getForumIDBoards(isClose,boardEl, id);

    van.add(bbForumNav,
      button({class:"nav-button",onclick:()=>navForum()}, "Forums[x]"),
    );
    van.add(bbForumNav,
      displayButtonCreateBoard()
    );

    return isClose.val ? null : div({id:"forum",class:"forum-container" },
      HomeNavMenu(),
      div({class:"main-content"},
        bbForumNav,
        div({class:"forum-main"},
          boardEl
        )
      ),
    );
  }else{
    console.log("NOT FOUND ID");
    const bbForumNav = div({id:'nav',class:"nav-container"});
    van.add(bbForumNav,
      displayButtonCreateForum(),
    );

    return isClose.val ? null : div({id:"forum",class:"forum-container" },
      HomeNavMenu(),
      div({class:"main-content"},
        bbForumNav,
        div({class:"forum-main"},
          getForums(isClose)
        )
      ),
    );
  }

}

export {
  pageForum,
  displayButtonCreateForum,
  createFormForum,
}