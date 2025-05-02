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
// import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { aliasState, loginState, forumIDState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";

const {button, input, textarea, i, p, h2, label, div} = van.tags;

// BUTTON CREATE COMMENT
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
// CREATE FORM COMMENT
function createCommentForm({closed}){

  const commentContent = van.state('test');

  async function btnCreateComment(){
    // console.log("create Topic");
    try{
      const data = await useFetch('/api/comment',{
        method:'POST',
        body:JSON.stringify({
          parentid:topicIDState.val,
          content:commentContent.val,
        })
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
        if(data?.api == "CREATE"){
          notify({
            color:Color.success,
            content:"Create Comment!"
          });
          // if(closed){
            closed.val = true;
          // }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Comment!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Comment!"
        });
      }
      
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Comment Fail!"
      });
    }
  }

  return div({id:'commentForm',class:"ccontent"},
    div({class:"modal-form-group"},
      label({class:"report-content"},'Content:'),
      textarea({value:commentContent, oninput:e=>commentContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnCreateComment},'Create'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// PAGE COMMENT
function pageComment() {

  return baseLayout({children:
    div({class:"comment-content"},
      div({class:"comment-header"},
        displayButtonCreateComment()
      ),
      div({class:"comment-list"}, topicEl)
    )
  });

}
// EDIT FORUM
function editFormComment({closed,id,content}){

  // console.log(id);
  const commentId = van.state(id);
  const commentContent = van.state(content);

  async function btnUpdateForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/comment/${commentId.val}`,{
        method:'PUT',
        body:JSON.stringify({
          id:commentId.val,
          content:commentContent.val,
        })
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
        if(data?.api == "UPDATE"){
          notify({
            color:Color.success,
            content:"Update Comment!"
          });

          let content = document.getElementById(commentId.val);
          // console.log(content);
          let elContent = content.children[2].children[0];// content
          // console.log("elContent: ", elContent)
          elContent.textContent = '[Content] '+ commentContent.val;
          // if(closed){
            closed.val = true;
          // }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Comment!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Comment!"
        });
      }
      
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Update Comment Fail!"
      });
    }
  }

  return div({id:'formComment',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"commentId"},"Comment ID:"),
      label({},commentId.val)
    ),
    div({class:"modal-form-group"},
      label({class:""},'Content:'),
      textarea({placeholder:"Enter Comment", value:commentContent, oninput:e=>commentContent.val=e.target.value})
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"submit-btn",onclick:btnUpdateForum},'Update'),
      button({type:"submit",class:"cancel-btn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// DELETE FORUM
function deleteFormComment({closed,id,content}){

  // console.log(id);
  const commentId = van.state(id);
  const commentContent = van.state(content);

  async function btnDeleteForum(){
    // console.log("create forum");
    try{
      const data = await useFetch(`/api/comment/${commentId.val}`,{
        method:'DELETE'
      });
      // console.log(data);
      if(data){
        // console.log(">>>");
        if(data?.api == "DELETE"){
          notify({
            color:Color.success,
            content:"Delete Comment!"
          });
          // closed.val = true;
          let ccontent = document.getElementById(commentId.val);
          if(ccontent.parentNode){
            ccontent.parentNode.removeChild(ccontent);
          }
        }else if(data?.api == "ERROR"){
          notify({
            color:Color.error,
            content:"Error Fetch Comment!"
          });
        }
      }else{
        notify({
          color:Color.error,
          content:"Null Comment!"
        });
      }
      // if(closed){
        closed.val = true;
      // }
    }catch(e){
      console.log("ERROR",e);
      notify({
        color:Color.error,
        content:"Create Comment Fail!"
      });
    }
  }

  return div({id:'formComment',style:"",class:"ccontent"},
    div({class:"modal-form-group"},
      label({for:"commentTitle"},"Comment ID:"),
      p({},commentId.val)
    ),
    div({class:"modal-form-group"},
      label({class:""},'Content:'),
      p({},commentContent.val)
    ),
    div({class:"modal-actions"},
      button({type:"button",class:"warn",onclick:btnDeleteForum},'Delete'),
      button({type:"submit",class:"normal",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}
// GET TOPIC FOR COMMENTS
export async function getTopicIDComments(topicEl, _id){

  const isEditModal = van.state(false);
  const isDeleteModal = van.state(false);
  // console.log("get comments");
  function getCommentID(_id){
    console.log("Comment ID", _id);
    commentIDState.val = _id;
    //navigate('/comment/'+_id);
  }

  function editComment(id,content){
    console.log("edit topic:",id);
    isEditModal.val = false;
    van.add(document.body, Modal({closed:isEditModal},editFormComment({
      closed:isEditModal,
      id:id,
      content:content
    })));
  }
  
  function deleteComment(id,content){
    console.log("delete topic:",id);
    isDeleteModal.val = false;
    van.add(document.body, Modal({closed:isDeleteModal},deleteFormComment({
      closed:isDeleteModal,
      id:id,
      content:content
    })));
  }
  // <i class="fa-solid fa-thumbs-up"></i>
  // <i class="fa-solid fa-thumbs-down"></i>
  // <i class="fa-solid fa-pen-to-square"></i>
  // <i class="fa-solid fa-trash"></i>
  try{
    const data = await useFetch(`/api/comments/${_id}`);
    // console.log(data);
    if(data){
      for(let item of data){
        // console.log("item: ", item);
        van.add(topicEl, div({id:item.id, class:"comment-item"},
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
              button({class:"edit-btn",onclick:()=>editComment(item.id,item.content)},
                i({class:"fa-solid fa-pen-to-square"}),
                label(" Edit")
              ),
              button({class:"delete-btn",onclick:()=>deleteComment(item.id,item.content)},
                i({class:"fa-solid fa-trash"}),
                label(" Delete")
              ),
              button({class:"report-btn"},
                i({class:"fa-solid fa-flag"}),
                label(" Report")
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