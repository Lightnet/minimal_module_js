/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { baseLayout } from "./base_layout.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, input, textarea, i, h2, label, div, table, tbody, tr,td} = van.tags;

import { aliasState, loginState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";

function displayButtonCreateComment(){

  const isCreated = van.state(false);

  function btnCreateTopic(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createCommentForm({closed:isCreated})
    ));
  }

  return button({class:"nav-button",onclick:()=>btnCreateTopic()},"Create Comment");
}

function createCommentForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateComment(){
    // console.log("create Topic");
    try{
      const data = await useFetch('/api/comment',{
        method:'POST',
        body:JSON.stringify({
          parentid:topicIDState.val,
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

  return div({id:'commentForm',class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Comment Title:"),
      input({type:"text",value:forumTitle, oninput:e=>forumTitle.val=e.target.value})
    ),
    div({class:"form-group"},
      label({class:"report-content"},'Content:'),
      textarea({value:forumContent, oninput:e=>forumContent.val=e.target.value})
    ),
    div({class:"form-group"},
      button({class:"normal",onclick:btnCreateComment},'Create'),
      button({class:"warn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

// PAGE COMMENT
function pageComment() {
  // van.derive(() => {
  //   console.log("[BOARD] FORUM ID:>> ",getRouterQuery()); // { section: "profile" }
  //   console.log("getRouterParams >> ",getRouterParams()); 
  // });

  return baseLayout({children:
    div({class:"comment-content"},
      div({class:"comment-header"},
        displayButtonCreateComment()
      ),
      div({class:"comment-list"}, topicEl)
    )
  });

}

export async function getTopicIDComments(topicEl, _id){

  // console.log("get comments");

  function getCommentID(_id){
    commentIDState.val = _id;
    //navigate('/comment/'+_id);
  }
  // <i class="fa-solid fa-thumbs-up"></i>
  // <i class="fa-solid fa-thumbs-down"></i>
  // <i class="fa-solid fa-pen-to-square"></i>
  // <i class="fa-solid fa-trash"></i>
  try{
    const data = await useFetch('/api/topic/'+_id);
    console.log(data);
    if(data){
      for(let item of data){
        // console.log("item: ", item);
        van.add(topicEl, div({class:"comment-item"},
          div({class:"comment-header"},
            // div({class:"comment-title"},
            //   h2(`[Comment] ${item.title}`), 
            // ),
            div({class:"comment-actions"},
              button({class:"like-btn"},
                i({class:"fas fa-thumbs-up"}),
                label(" Like")
              ),
              button({class:"dislike-btn"},
                i({class:"fas fa-thumbs-down"}),
                label(" Dislike")
              ),
              button({class:"reply-btn"},
                i({class:"fa-solid fa-reply"}),
                label(" Reply")
              ),
              button({class:"edit-btn"},
                i({class:"fa-solid fa-pen-to-square"}),
                label(" Edit")
              ),
              button({class:"delete-btn"},
                i({class:"fa-solid fa-trash"}),
                label(" Delete")
              ),
            ),
          ),
          div({class:"comment-meta"}, label("Posted on XXX XX, XXXX")),
          div({class:"comment-content",onclick:()=>getCommentID(item.id)},label(" [ Content ] "+ item.content))
        ));
      }
    }
  }catch(e){
    console.log(e);
  }

}


export {
  createCommentForm,
  displayButtonCreateComment,
  pageComment
}