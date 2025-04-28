/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import {forumIDState} from "/components/context.js";
import useFetch from "../../libs/useFetch.js";
// import { baseLayout } from "./base_layout.js";
import { displayButtonCreateBoard, getForumIDBoards } from "./bb_board.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, i, input, label,textarea, link, div, span, h2, table, tbody, tr, td} = van.tags;

const getForumsEL = () => {

  const forumList = div({class:"forum-container"});

  function editForum(id){
    console.log("editForum:",id);
  }

  function deleteForum(id){
    console.log("deleteForum:",id);
  }

  function enterForum(id){
    console.log("Forum ID HERE?: ",id);
    forumIDState.val = id;
    navigate('/forum/'+id);
  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      console.log(data);
      if(data){
        for(let ii=0; ii < data.length;ii++){
          van.add(forumList, div({class:'forum-item'},
              div({class:'forum-header'},
                div({class:"forum-title"},
                  h2({onclick:()=>enterForum(data[ii].id)},`[ Forum ] ${data[ii].title}`),
                ),
                div({class:"action-buttons"},
                  button({class:"edit-btn",onclick:()=>editForum(data[ii].id)},
                    i({class:"fa-solid fa-pen-to-square"}),
                    label(' Edit'),
                  ),
                  button({class:"delete-btn",onclick:()=>deleteForum(data[ii].id)},
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
      createForumForm({closed:isCreated})
    ));
  }

  return button({class:"nav-button", onclick:()=>btnCreateForum()},"Create Forum");
}

// CREATE FORUM
function createForumForm({closed}){

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
      // console.log(data);
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e)
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

// GET CURRENT FORUM ID for boards
function pageForumID() {
  // console.log("FORUM ID???");
  const boardEl = div({id:"BOARDS",class:""});
  const bbForumNav = div({id:'nav'});

  //get forums
  van.derive(() => {
    const { id } = getRouterParams();    
    // console.log("FORUM ID:", id);
    if(id){
      if(id.length > 0){
        getForumIDBoards(boardEl, id);
      }
    }
  });

  van.derive(() => {
    
    while (bbForumNav.lastElementChild) { // clear children
      bbForumNav.removeChild(bbForumNav.lastElementChild);
    }
    // forumIDState
    console.log("forumIDState:", forumIDState.val)
    van.add(bbForumNav,
      button({class:"nav-button",onclick:()=>navigate('/forum')}, "Forum"),
    );

    van.add(bbForumNav,
      displayButtonCreateBoard()
    );

    // van.add(bbForumNav,
    //   button({class:"normal",onclick:()=>goToForum(forumIDState.val)}, "Index"),
    // );
  });

  return div({id:"home",class:"forum-container" },
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
  pageForumID,
  displayButtonCreateForum,
  createForumForm,
}