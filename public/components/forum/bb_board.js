/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { baseLayout } from "./base_layout.js";
import { displayButtonCreateTopic, getBoardIDTopics } from "./bb_topic.js";
import { aliasState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, link, input, label, p, div, table, tbody, tr, td, h2} = van.tags;

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

  return div({id:'createBoard'},
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
          button({class:"nav-button",onclick:btnCreateBoard},'Create'),
          button({class:"nav-button",onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
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

  const topicEl = div('TOPICS');

  van.derive(() => {
    const { id } = getRouterParams();
    if(id){
      boardIDState.val = id;
      getBoardIDTopics(topicEl, id);
    }
  });

  // return baseLayout({children:
  //   topicEl
  // });

  return div({id:"home",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      //bbPostTypeEL,
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
              button({class:"edit-btn"},"Edit"),
              button({class:"delete-btn"},"Delete"),
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