/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "van";
import { useFetch } from "./useFetch.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, input, label, div, table, tbody, tr, td, center} = van.tags;

const ForgotEL = () => {
  const user = van.state('guest');
  const email = van.state('');

  async function btnForgot(){
    console.log(user.val)
    console.log(email.val)

    let data = await useFetch('/api/auth/forgot',{
      method:'POST',
      body:JSON.stringify({
        alias:user.val,
        email:email.val,
      })
    });
    console.log(data);
  }

  async function c_cancel(){
    navigate("/");
  }

  return div({id:'forgot',class:"ccontent"},
  center(
    table(
      tbody(
        tr(
          td({colspan:"2",class:"cheader"},
            center(label('Forgot'))
          ),
        ),
        tr(
          td(label('User:')),
          td(input({type:"text",value:user, oninput:e=>user.val=e.target.value}))
        ),
        tr(
          td(label('E-Mail:')),
          td(input({type:"text",value:email, oninput:e=>email.val=e.target.value}))
        ),
        tr({colspan:"2"},
          td({colspan:"2"},
            button({class:"normal",onclick:btnForgot,style:"width:100%"},'Recovery')
          )
        ),
        tr({colspan:"2"},
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
  ForgotEL,
}
