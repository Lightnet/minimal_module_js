/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
const {button, input, label, div, table, tbody, tr, td, center} = van.tags;

import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { useFetch } from "/libs/useFetch.js";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";

const SignUpEL = () => {

  const displayuser = van.state('guest');
  const username = van.state('guest');
  const pass = van.state('guest');
  const pass2 = van.state('guest');
  const email = van.state('guest');
  const email2 = van.state('guest');

  async function c_signup(){
    // console.log("Login...")
    // console.log(username.val)
    // console.log(pass.val)
    try {
      let data = await useFetch('/api/auth/signup',{
        method:'POST',
        body:JSON.stringify({
          alias:displayuser.val,
          username:username.val,
          passphrase:pass.val,
          email:email.val,
        })
      });
      console.log(data);  
      if(data){
        if(data?.api){
          if(data.api=='EXIST'){
            notify({
              color:Color.warn,
              content:"Account Exist!"
            });
          }
          if(data.api=='CREATE'){
            notify({
              color:Color.success,
              content:"Account Created!"
            });
          }
        }
      }
    } catch (error) {
      notify({
        color:Color.warn,
        content:"Fail Sign Up!"
      });
    }
    
  }

  async function c_cancel(){
    navigate("/");
  }

  return div({id:'Signup',class:"ccontent"},
  center(
    table(
      tbody(
        tr(
          td({colspan:"2",class:"cheader"},
            center(
              label('Sign Up')
            )
          ),
        ),
        // tr(
        //   td(label('Display User:')),
        //   td(input({type:"text",value:displayuser, oninput:e=>displayuser.val=e.target.value}))
        // ),
        tr(
          td(label('User Name:')),
          td(input({type:"text",value:username, oninput:e=>username.val=e.target.value}))
        ),
        tr(
          td(label('Passphrase #1:')),
          td(input({type:"text",value:pass2, oninput:e=>pass2.val=e.target.value}))
        ),
        tr(
          td(label('Passphrase #2:')),
          td(input({type:"text",value:pass, oninput:e=>pass.val=e.target.value}))
        ),
        tr(
          td(label('Email #1:')),
          td(input({type:"text",value:email, oninput:e=>email.val=e.target.value}))
        ),
        tr(
          td(label('Email #2:')),
          td(input({type:"text",value:email2, oninput:e=>email2.val=e.target.value}))
        ),
        tr(
          td({colspan:"2"},
            button({class:"normal",onclick:c_signup,style:"width:100%"},'Register')
          )
        ),
        tr(
          td({colspan:"2"},
            button({class:"warn",onclick:c_cancel,style:"width:100%"},'Cancel')
          )
        )
      )
    )
    )
  )
}

export{
  SignUpEL,
}
