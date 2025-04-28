/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { baseLayout } from "./base_layout.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { displayButtonCreateComment, getTopicIDComments } from "./bb_comment.js";
import { aliasState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { HomeNavMenu } from "../navmenu.js";
import { topicContentState, topicTitleState } from "../context.js";

const {button, input, i, link, label, h2, div, table, tbody, tr,td} = van.tags;

function displayButtonCreateTopic(){

  const isCreated = van.state(false);

  function btnCreateTopic(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createTopicForm({closed:isCreated})
    ));
  }

  return button({class:"nav-button",onclick:()=>btnCreateTopic()},"Create Topic");
}

function createTopicForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateTopic(){
    // console.log("create Topic");
    try{
      const data = await useFetch('/api/topic',{
        method:'POST',
        body:JSON.stringify({
          parentid:boardIDState.val,
          title:forumTitle.val,
          content:forumContent.val,
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

  return div({id:'createTopic'},
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
          button({onclick:btnCreateTopic},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  );

}

// PAGE TOPIC ID
// This get comments
function pageTopic() {

  // if(!document.getElementById("forum_style")){
  //   van.add(document.head, link({
  //     id:"forum_style",
  //     rel:"stylesheet",
  //     type:"text/css",
  //     href:"/components/forum/forum.css"
  //   }))
  // }

  const topicEl = div({class:"comment-list"});
  const bbforumNav = div();

  van.derive(() => {
    // console.log("Page_Topic getRouterParams >> ",getRouterParams()); 
    const { id } = getRouterParams();

    if(id){
      topicIDState.val = id;
      while (topicEl.lastElementChild) {// clear children
        topicEl.removeChild(topicEl.lastElementChild);
      }

      van.add(topicEl,div({id:id, class:'topic-item'},
        div({class:'topic-header'},
          div({class:"topic-title"},
            h2("[Topic] "+ topicTitleState.val),
          ),
          // div({class:"action-buttons"},
          //   button({class:"edit-btn"},'Edit'),
          //   button({class:"delete-btn"},'Delete'),
          // )
        ),
        div({class:"topic-content"},label(" [ Content ] "+ topicContentState.val))
      )),
      getTopicIDComments(topicEl, id);
    }
  });

  van.derive(() => {
    while (bbforumNav.lastElementChild) {// clear children
      bbforumNav.removeChild(bbforumNav.lastElementChild);
    }
    van.add(bbforumNav,
      button({class:"normal",onclick:()=>navigate('/forum')},"Forums"),
    );
    van.add(bbforumNav,
      button({class:"normal",onclick:()=>navigate('/forum/'+forumIDState.val)},"Boards"),
    );
    van.add(bbforumNav,
      button({class:"normal",onclick:()=>navigate('/board/'+boardIDState.val)},"Topics"),
    );
  });

  return div({id:"home",class:"forum-container" },
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

  function getTopicID(_id, _title, _content){
    // topicIDState.val = _id;
    topicIDState.val = _id;
    topicTitleState.val = _title;
    topicContentState.val = _content;
    navigate('/topic/'+_id);
  }

  // get board data
  // create board element
  // container
  // - title
  // - content
  try{
    const data = await useFetch('/api/board/'+_id);
    console.log(data);
    if(data){
      for(let item of data){
        console.log("item: ", item);
        // BOARD CONTENT
        van.add(topicEl, div({class:'topic-item'},
          div({class:'topic-header'},
            div({class:"topic-title",onclick:()=>getTopicID(item.id, item.title, item.content)},
              h2("[Topic] "+ item.title),
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
            )
          ),
          div({class:"topic-content",onclick:()=>getTopicID(item.id, item.title, item.content)},label(" [ Content ] "+ item.content),)
        ));
      }
    }
  }catch(e){
    console.log(e);
  }
}

export {
  displayButtonCreateTopic,
  createTopicForm,
  pageTopic
}