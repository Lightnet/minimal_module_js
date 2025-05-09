/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
const {button, input, label, div, script} = van.tags;
import useFetch from '/libs/useFetch.js';
const AccountEL = () => {

  const ELInfon = div()

  async function c_info(){
    try {
      let data = await useFetch('/api/auth/user');
      console.log(data);
      if(data){
        ELInfon.innerHTML = '';//clear children
        van.add(ELInfon,div(
          div(
            label('Name:'+data.alias),
          ),
          div(
            label('Role:'+data.role),
          ),
          div(
            label('Date Join:'+data.join),
          ),          
        ))
      }

    } catch (error) {
      console.log("error: ", error.message)
    }
  }

  return div({id:'account'},
    div(
      label(' Account '),
      button({onclick:c_info},'Info')
    ),
    ELInfon,
  )
}

export {
  AccountEL,
}
