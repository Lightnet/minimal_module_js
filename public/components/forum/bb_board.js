/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { baseLayout } from "./base_layout.js";
import { displayButtonCreateTopic, getBoardIDTopics } from "./bb_topic.js";
import { aliasState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, i, textarea, link, input, label, p, div, table, tbody, tr, td, h2} = van.tags;

function displayButtonCreateBoard(){

  const isCreated = van.state(false);

  function btnCreateBoard(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createBoardForm({closed:isCreated})
    ));
  }

  return button({class:"nav-button",onclick:()=>btnCreateBoard()},"Create Board");
}

function createBoardForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateBoard(){
    // console.log("create board");
    try{
      const data = await useFetch('/api/board',{
        method:'POST',
        body:JSON.stringify({
          parentid:forumIDState.val,
          title:forumTitle.val,
          content:forumContent.val,
        })
      });
      // console.log(data);
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e);
    }
  }

  return div({id:'boardForm',class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Board Title:"),
      input({type:"text",value:forumTitle, oninput:e=>forumTitle.val=e.target.value})
    ),
    div({class:"form-group"},
      label({class:"report-content"},'Content:'),
      textarea({value:forumContent, oninput:e=>forumContent.val=e.target.value})
    ),
    div({class:"form-group"},
      button({class:"normal",onclick:btnCreateBoard},'Create'),
      button({class:"warn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

// PAGE BOARD
function pageBoard() {

  // if(!document.getElementById("forum_style")){
  //   van.add(document.head, link({
  //     id:"forum_style",
  //     rel:"stylesheet",
  //     type:"text/css",
  //     href:"/components/forum/forum.css"
  //   }))
  // }

  const bbforumNav = div();

  const topicEl = div({id:'topics'});

  van.derive(() => {
    const { id } = getRouterParams();
    if(id){
      getBoardIDTopics(topicEl, id);

      while (bbforumNav.lastElementChild) {// clear children
        bbforumNav.removeChild(bbforumNav.lastElementChild);
      }
      van.add(bbforumNav,
        button({class:"normal",onclick:()=>navigate('/forum/'+boardIDState.val)},"Forum"),
      );
      van.add(bbforumNav,
        button({class:"normal",onclick:()=>navigate('/forum/'+forumIDState.val)},"Board"),
      );

      van.add(bbforumNav,
        displayButtonCreateTopic()
      );

    }
  });

  return div({id:"home",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      bbforumNav,
      div({class:"forum-main"},
        topicEl
      )
    ),
  );

}

export async function getForumIDBoards(boardEl, _id){

  function getBoardID(_id){
    boardIDState.val = _id;
    navigate('/board/'+_id);
  }

  try{
    const data = await useFetch('/api/forum/'+_id);
    // console.log("get FORUM Boards:", data);
    if(data){
      for(let item of data){
        // console.log("item: ", item);
        // div container
        // div title (alight left)   Edit, Delete(align right)
        // div content

        van.add(boardEl, div({class:"board-container"},
          div({class:'board-header'},
            div({class:"board-title"},
              h2({onclick:()=>getBoardID(item.id)},`[Board] ${item.title}`), 
            ),
            div({class:"action-buttons"},
              button({class:"edit-btn"},
                i({class:"fa-solid fa-pen-to-square"}),
                label(" Edit")
              ),
              button({class:"delete-btn"},
                i({class:"fa-solid fa-trash"}),
                label(" Delete")
              ),
            )
          ),
          p({class:"board-description",onclick:()=>getBoardID(item.id)},label(" [ Content ] "+ item.content),)
        ));
      }
    }
  }catch(e){
    console.log("ERROR",e)
  }
}

export {
  displayButtonCreateBoard,
  createBoardForm,
  pageBoard
}