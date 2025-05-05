/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import useFetch from "../../libs/useFetch.js";
import { notify } from "../notify/notify.js";
import { Color } from "../notify/notifycontext.js";

const {button, i, input, label, div, h2, h3, select, option, table, tbody, thead, tr, th, td  } = van.tags;

async function cConfirmDeleteFetch(item){
  try {
    let data = await useFetch(`/api/permissions/${item.id}`,{
      method:'DELETE'
    });
    console.log(data)
    if(data){
      if(data?.error){
        notify({
          color:Color.error,
          content:data.error
        });
        return;
      }
      notify({
        color:Color.success,
        content:`Delete Permission! ID:${item.id} Type:${item.entity_type} Entity ID:${item.entity_id} Resource:${item.resource_type} Action:${item.action}`
      });

      let permissionNode = document.getElementById(item.id);
      console.log("permissionNode: ", permissionNode);
      console.log("parentNode: ", permissionNode.parentNode);
      if( permissionNode.parentNode){
        permissionNode.parentNode.removeChild(permissionNode);
      }

    }
  } catch (error) {
    console.log(error.message);
  }
}

async function btnDeletePermission(item){
  //
  const isDeleteModal = van.state(false);
  van.add(document.body, Modal({closed:isDeleteModal},
    div(
      div(
        label(`Confirm Delete? ID: ${item.id} Type:${item.entity_type} Entity:${item.entity_id}`),
      ),
      div(
        button({class:"warn",onclick:()=>{cConfirmDeleteFetch(item);isDeleteModal.val=true}},"Delete"),
        button({class:"normal",onclick:()=>isDeleteModal.val=true},"Cancel")
      )
    )
  ))
}

async function loadPermissions() {
  try {
    console.log("update table permissions.")
    const data = await useFetch('/api/permissions');
    console.log("data: ", data);
    const _tbody = document.getElementById('permissions-table');

    while (_tbody.firstChild) {
      _tbody.removeChild(_tbody.lastChild);
    }

    for(let item of data){
      van.add(_tbody,
        tr({id:item.id},
          td(item.id),
          td(item.entity_type),
          td(item.entity_id),
          td(item.resource_type),
          td(item.resource_id || '-'),
          td(item.action),
          td(item.allowed ? 'Yes' : 'No'),
          td(
            button({class:"warn",onclick:()=>btnDeletePermission(item)}, "DELETE")
          ),
        )
      )
    }

  }catch (error) {
    //showAlert('Failed to load permissions', 'danger');
    console.log("Failed to load permissions");
  }
}

export function btnCreateFormPermission(){
  function clickCreateFormPermission(){
    const isModal = van.state(false);
    van.add(document.body, Modal({closed:isModal},
      renderFormPermission(isModal)
    ));
  }
  return button({onclick:clickCreateFormPermission},"Add Permission");
}

export function renderFormPermission(isModal){

  const entity_type = van.state('role');
  const entity_id = van.state('');
  const resource_type = van.state('forum');
  const resource_id = van.state('');
  const action = van.state('create');
  const isAllowed = van.state(true);

  async function updateEntityIdOptions() {
    const entityType = document.getElementById('entity_type').value;
    const entityIdSelect = document.getElementById('entity_id');
    entityIdSelect.innerHTML = '<option value="">Select Entity</option>';
    console.log("entityType: ", entityType);
    if (entityType === 'role') {
      console.log("entityType: ", entityType)
      const roles = ['user', 'moderator', 'admin'];
      roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        entityIdSelect.appendChild(option);
      });
    } else if (entityType === 'group'){
      try {
        const data = await useFetch('/api/groups');
        // const groups = await response.json();
        for(const item of data){
          van.add(entityIdSelect,
            option({value:item.id}, `${item.name} (ID:${item.id})`)
          )
        }
        console.log(data);
      }catch (error) {
        //showAlert('Failed to load groups', 'danger');
        console.log("Failed to load groups");
      }
    }
  }

  async function fetchAddPermission(){
    console.log("Add Permission")
    console.log("entity_type: ", entity_type.val);
    console.log("entity_id: ", entity_id.val);
    console.log("resource_type: ", resource_type.val);
    console.log("resource_id: ", resource_id.val);
    console.log("action: ", action.val);
    console.log("isAllowed: ", isAllowed.val);

    try {
      let allow;
      console.log("isAllowed.val: ",isAllowed.val);
      if(isAllowed.val){
        allow = 'true';
        console.log("allow: ",allow);
      }else{
        allow = 'false';
      }
      let data = {
        entity_type:entity_type.val,
        entity_id:entity_id.val,
        resource_type:resource_type.val,
        resource_id:resource_id.val || null,
        action:action.val,
        allowed:allow
      };
      console.log(data);

      const fetch_data = await useFetch(`/api/permissions`,{
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log("fetch_data: ", fetch_data);
      if(fetch_data?.error){
        notify({
          color:Color.error,
          content:data.error
        })
        return;
      }
      loadPermissions();
      notify({
        color:Color.success,
        content:`Add Permission entity_type:${entity_type.val}, entity_id:${entity_id.val}`
      })
      isModal.val=true;
    } catch (error) {
      console.log("error: ", error.message);
    }
  }

  setTimeout(()=>{
    updateEntityIdOptions();
    loadPermissions();
    document.getElementById('entity_type').addEventListener('change', updateEntityIdOptions);
  },100);


  return div({class:"form-container"},
    h3("Add Permission"),
    div({id:"form-alert",class:"alert",role:"alert"}),
    div({id:"permission-form"},
      div({class:"mb-3"},
        label("Entity Type: "),
        select({id:"entity_type",value:entity_type,onchange:(e)=>entity_type.val=e.target.value},
          option({value:"role"}, "Role"),
          option({value:"group"}, "Group"),
        )
      ),
      div({class:"mb-3"},
        label("Entity ID: "),
        select({id:"entity_id",value:entity_id,onchange:(e)=>entity_id.val=e.target.value})
      ),
      div({class:"mb-3"},
        label("Resource Type: "),
        select({id:"resource_type",value:resource_type,onchange:(e)=>resource_type.val=e.target.value},
          option({value:"forum"}, "Forum"),
          option({value:"board"}, "Board"),
          option({value:"topic"}, "Topic"),
          option({value:"comment"}, "Comment"),
          option({value:"user"}, "User"),
          option({value:"group"}, "Group"),
          option({value:"permissions"}, "Permissions"),
          option({value:"group_memberships"}, "Group Memberships"),
        )
      ),
      div({class:"mb-3"},
        label("Resource ID (Optional): "),
        input({type:"number",id:"resource_id",value:resource_id,oninput:(e)=>resource_id.val=e.target.value}),
      ),
      div({class:"mb-3"},
        label("Action: "),
        select({id:"action",value:action,onchange:(e)=>action.val=e.target.value},
          option({value:"create"}, "Create"),
          option({value:"read"}, "Read"),
          option({value:"update"}, "Update"),
          option({value:"delete"}, "Delete"),
          option({value:"manage"}, "Manage"),
        )
      ),
      div({class:"mb-3"},
        label("Allowed: "),
        input({type:"checkbox", checked:isAllowed, onclick:(e)=>isAllowed.val=e.target.checked}),
      ),
      button({onclick:fetchAddPermission},"Add"),
      button({onclick:()=>isModal.val=true},"Cancel"),
    )
  )
}

export function renderPermissionTable(){

  const permissionList = tbody({id:"permissions-table"});

  loadPermissions();

  return div({class:"table-container"},
    h3("Permissions List"),
    table({class:"table table-striped"},
      thead(
        tr(
          th("ID"),
          th("Entity Type"),
          th("Entity ID"),
          th("Resource Type"),
          th("Resource ID"),
          th("Action"),
          th("Allowed"),
          th("Actions"),
        ),
      ),
      permissionList
    )
  )
}