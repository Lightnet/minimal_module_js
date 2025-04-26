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
import { baseLayout } from "./base_layout.js";
import { getForumIDBoards } from "./bb_board.js";

const {button, input, label, link, div, span, h2, table, tbody, tr,td} = van.tags;

const getForumsEL = () => {

  const forumList = div({class:"forum-container"});

  function editForum(id){
    console.log("editForum:",id);
  }

  function deleteForum(id){
    console.log("deleteForum:",id);
  }

  function enterForum(id){
    // console.log("Forum ID HERE?: ",id);
    forumIDState.val = id;
    navigate('/forum/'+id);
  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      console.log(data);
      if(data){
        for(let i=0; i < data.length;i++){
          van.add(forumList, div({class:'forum-item'},
              div({class:'forum-header'},
                div({class:"forum-title"},
                  h2({onclick:()=>enterForum(data[i].id)},`?[ Forum ] ${data[i].title}`),
                ),
                div({class:"action-buttons"},
                  button({class:"edit-btn",onclick:()=>editForum(data[i].id)},'Edit'),
                  button({class:"delete-btn",onclick:()=>deleteForum(data[i].id)},'Delete'),
                ),
              ),
              div({class:'forum-content',onclick:()=>enterForum(data[i].id)},
                data[i].content
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

  return div({id:'createForum'},
    table(
      tbody(
        tr(
          td(label('Title:')),
          td(input({value:forumTitle, oninput:e=>forumTitle.val=e.target.value})),
        ),
        tr(
          td(label('Content:')),
          td(input({value:forumContent, oninput:e=>forumContent.val=e.target.value})),
        ),
        tr(
          button({class:"action-buttons",onclick:btnCreateForum},'Create'),
          button({class:"action-buttons",onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

// GET CURRENT FORUM ID for boards
function pageForumID() {
  // console.log("FORUM ID???");
  //If url > forum/:id
  if(!document.getElementById("forum_style")){
    van.add(document.head, link({
      id:"forum_style",
      rel:"stylesheet",
      type:"text/css",
      href:"/components/forum/forum.css"
    }))
  }

  const boardEl = div({id:"BOARDS",class:""});

  //get forums
  van.derive(() => {
    const { id } = getRouterParams();    
    // console.log("FORUM ID:", id);
    if(id){
      if(id.length > 0){
        // console.log("BOARD HERE???");
        forumIDState.val = id;
        getForumIDBoards(boardEl, id);
      }
    }
  });

  return baseLayout({children:
    boardEl
  });
}

export {
  getForumsEL,
  pageForumID,
  displayButtonCreateForum,
  createForumForm,
}