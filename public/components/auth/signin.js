/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { useFetch } from "./useFetch.js";
const {button, input, label, div, table, tbody, tr, td, center} = van.tags;
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";
import { aliasState, loginState ,roleState } from "../context.js";

const SignInEL = (_url='/') => {
  const user = van.state('guest');
  const pass = van.state('guest');

  async function c_login(){
    // console.log("Login...")
    // console.log(user.val)
    // console.log(pass.val)

    let data = await useFetch('/api/auth/signin',{
      method:'POST',
      body:JSON.stringify({
        alias:user.val,
        passphrase:pass.val,
      })
    });
    // console.log(data);
    if(data){
      if(data?.api){
        if(data.api == 'PASS'){
          aliasState.val = user.val
          roleState.val = data.role;
          loginState.val = true;
          pass.val = '';
          notify({
            color:Color.success,
            content:"Sign In Success!"
          })
          navigate(_url)
        }else{
          notify({
            color:Color.warn,
            content:"Fail Sign In!"
          })
        }
      }
    }
  }

  async function c_cancel(){
    navigate("/");
  }

  return div({id:'login',class:"ccontent"},
  center(
    table(
      tbody(
        tr(
          td({colspan:"2",class:"cheader"},
            center(
              label('ACCESS'),
            )
          ),
        ),
        tr(
          td(label('User:')),
          td(input({type:"text",value:user, oninput:e=>user.val=e.target.value}))
        ),
        tr(
          td(label('Passphrase:')),
          td(input({type:"text",value:pass, oninput:e=>pass.val=e.target.value}))
        ),
        tr(
          td({colspan:"2"},
            button({class:"normal",onclick:c_login,style:"width:100%"},'Login')
          )
        ),
        tr(
          td({colspan:"2"},
            button({class:"warn",onclick:()=>navigate("/forgot"),style:"width:100%"},'Forgot')
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
  SignInEL,
}
