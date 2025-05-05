/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { useFetch } from "/libs/useFetch.js";
import { 
  aliasState,
  loginState
} from "/components/context.js";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";
const {button, input, label, div, table, tbody, tr, td,center} = van.tags;

const SignOutEL = (_url='/') => {

  async function b_signout(){
    let data = await useFetch('/api/auth/signout',{
      method:'POST',
      body:JSON.stringify({api:'LOGOUT'})
    });
    console.log(data);
    if(data?.api == 'PASS'){
      console.log("OKAY");
      aliasState.val = 'Guest';
      loginState.val = false;
      notify({
        color:Color.success,
        content:"Sign Out Success!"
      })
      navigate(_url);
    }
  }

  return div({class:"ccontent"},
    center(
      table(
        tbody(
          tr(
            td(
              center(label("[ ACCESS ]"))
            )
          ),
          tr(
            td(
              label("Are you sure to Logout?"),
            )
          ),
          tr(
            td({},
              button({class:"warn",style:"width:100%",onclick:b_signout},"Yes"),
            )
          ),
          tr(
            td({},
              button({class:"normal",style:"width:100%",onclick:()=>navigate("/")},"No"),
            )
          ),
        )
      )
    )
  );
}

export {
  SignOutEL
}

export default SignOutEL;