

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import useFetch from "../../libs/useFetch.js";
import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";

const {button, i, input, label,textarea, link, div, span, h2, h3, h4, p, form, select, option, table, tbody, thead, tr, th, td  } = van.tags;

// create form group
export function btnCreateGroup(){

  function clickCreateFormGroup(){
      const isModal = van.state(false);
      van.add(document.body, Modal({closed:isModal},
        renderFormGroup(isModal)
      ));
    }

  return button({onclick:clickCreateFormGroup},"Add Group");
}

async function fetch_delete_groupid(id){
  const data = await useFetch(`/api/groups/${id}`,{
    method:'DELETE'
  });

  console.log("data: ", data);
  if(data){
    if(data?.error == 'Group not found'){
      notify({
        color:Color.error,
        content:data.error
      })
      return;
    }

    if(data?.message == 'Group deleted'){
      notify({
        color:Color.success,
        content:data.message
      });
      let item_group  = document.getElementById(`groupid-${id}`);
      console.log("item_group:", item_group)
      let parentNode = item_group.parentNode;
      parentNode.removeChild(item_group);

      let option_group  = document.getElementById(`ogroupid-${id}`);
      parentNode = option_group.parentNode;
      parentNode.removeChild(option_group);
    }
  }
}

function btnEditGroupId(id, name){

}

function btnRemoveGroupId(id, name){
  const isDeleteGroupModal = van.state(false);
  van.add(document.body, Modal({closed:isDeleteGroupModal},div(
    label(`Delete Group: ${name} (ID:${id})`),
    button({class:"warn",onclick:()=>{fetch_delete_groupid(id);isDeleteGroupModal.val=true}},"Delete"),
    button({class:"normal",onclick:()=>{isDeleteGroupModal.val=true}},"Cancel"),
  )));
}
//fetch groups from db
async function loadGroups() {
  try {
    const data = await useFetch('/api/groups');
    console.log(data);
    const groups_table = document.getElementById('groups-table');
    const groupSelect = document.getElementById('group_id');
    console.log(groupSelect);

    for(const item of data){
      van.add(groups_table,
        tr({id:`groupid-${item.id}`},
          td(item.id),
          td(item.name),
          td(item.description ),
          td(item.created_at),
          td(
            button({class:"normal",onclick:()=>loadMemberships(item.id)},"View Members"),
            button({class:"normal",onclick:()=>btnEditGroupId(item.id,item.name)},"Edit"),
            button({class:"warn",onclick:()=>btnRemoveGroupId(item.id,item.name)},"Delete")
          ),
        )
      );

      //SELECT for options
      van.add(groupSelect,
        option({id:`ogroupid-${item.id}`,value:item.id}, `${item.name} (ID:${item.id})`)
      );
      // console.log("test....");
    }

  } catch (error) {
    console.log("loadGroups error!");
  }
}
// render form group for add group
export function renderFormGroup(isModal) {
  const groupName = van.state('');
  const groupDescription = van.state('');

  async function btnAddGroup(){
    try {
      const data = await useFetch(`/api/groups`,{
        method: 'POST',
        body:JSON.stringify({
          name:groupName.val,
          description:groupDescription.val,
        })
      });
      console.log(data);
      isModal.val = true;//close modal

      //
      if(data?.newGroup){
        console.log(data.newGroup);
        const _tbody = document.getElementById('groups-table');
        const groupSelect = document.getElementById('group_id');

        van.add(_tbody,
          tr({id:`groupid-${data.newGroup.id}`},
            td(data.newGroup.id),
            td(data.newGroup.name),
            td(data.newGroup.description ),
            td(data.newGroup.created_at),
            td(
              button({class:"normal",onclick:()=>loadMemberships(data.newGroup.id)},"View Members"),
              button({class:"normal",onclick:()=>btnEditGroupId(data.newGroup.id,data.newGroup.name)},"Edit"),
              button({class:"warn",onclick:()=>btnRemoveGroupId(data.newGroup.id,data.newGroup.name)},"Delete")
            ),
          )
        );

        van.add(groupSelect,
          option({id:`ogroupid-${data.newGroup.id}`,value:data.newGroup.id}, `${data.newGroup.name} (ID:${data.newGroup.id})`)
        );
      }
    } catch (error) {
      console.log("Faill to add group");
    }
  }

  return div({class:"ccontent"},
    h3("Add Group"),
    div({class:"modal-form-group"}),
    div({id:"modal-form-group"},
      label("Group Name: "),
      input({id:"name",type:"text",value:groupName,oninput:(e)=>groupName.val=e.target.value})
    ),
    div({id:"modal-form-group"},
      label("Description: "),
      textarea({id:"description",value:groupDescription,oninput:(e)=>groupDescription.val=e.target.value}),
    ),
    div({id:"modal-actions"},
      button({class:"normal",onclick:btnAddGroup},"Add"),
      button({onclick:()=>isModal.val=true},"Cancel"),
    )
  );
}

export function renderGroups(){

  const group_table = tbody({id:"groups-table"});

  setTimeout(()=>{
    loadGroups();
  },100);

  return div({class:"form-container"},
    h3("Groups List"),
    table({class:"table table-striped"},
      thead(
        tr(
          td("ID"),
          td("Name"),
          td("Description"),
          td("Created At"),
          td("Actions"),
        ),
      ),
      group_table
    ),
  );

}

async function btnAddGroupMembership(user_id, group_id){
  console.log("userId:", user_id);
  console.log("groupId:", group_id);
  const jsonData = {
    userId:parseInt(user_id, 10),
    groupId:parseInt(group_id, 10),
  }

  try {
    const data = await useFetch(`/api/groups/membership`,{
      method: 'POST',
      body: JSON.stringify(jsonData),
    });
    console.log(data);
    loadMemberships(group_id);
    if(data?.error){
      notify({
        color:Color.error,
        content:data.error
      });
      return;
    }
    notify({
      color:Color.success,
      content:"Assign Group Member Ship Pass!"
    });
    
  } catch (error) {
    notify({
      color:Color.error,
      content:"Assign Group Member Ship Fail!"
    });
  }
}

async function btnRemoveMGroupMembership(user_id, group_id){
  console.log("userId:", user_id);
  console.log("groupId:", group_id);
  const jsonData = {
    userId:parseInt(user_id, 10),
    groupId:parseInt(group_id, 10),
  }
  console.log(jsonData);

  try {
    const data = await useFetch(`/api/groups/membership`,{
      method: 'DELETE',
      body:JSON.stringify(jsonData)
    });
    console.log(data);
    if(data?.error){
      notify({
        color:Color.error,
        content:data.error
      });
      return;
    }
    notify({
      color:Color.success,
      content:"Remove Group Membership Delete!"
    });
    
  } catch (error) {
    console.log("ERROR");
  }
}

export function renderFormGroupMembership(){
  const groupId = van.state('');
  const userId = van.state('');

  return div({class:"form-container"},
    h3("Manage Group Membership"),
    div({class:"form-container"},
      div({id:"membership-form-alert", class:"alert"}),
        div({class:"modal-form-group"},
          label("Group"),
          select({id:"group_id",value:groupId,onchange:(e)=>groupId.val=e.target.value},
            option("Select Group")
          ),
        ),
        div({class:"modal-form-group"},
          label("User ID"),
          input({id:"user_id",value:userId,oninput:(e)=>userId.val=e.target.value}),
        ),
        div({class:"modal-actions"},
          button({class:"normal",onclick:()=>btnAddGroupMembership(userId.val,groupId.val)},"Add Membership"),
          button({class:"warn",onclick:()=>btnRemoveMGroupMembership(userId.val,groupId.val)},"Remove Membership"),
        ),
    ),
  );
}


async function loadMemberships(groupId) {
  const url = groupId ? `/api/groups/memberships/${groupId}` : `/api/groups/memberships`;
  try {
    const data = await useFetch(url);
    const _tbody = document.getElementById('memberships-table');
    const myNode = _tbody;
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
    // console.log("data:", data);
    for(const item of data){
      van.add(_tbody,
        tr(
          td(item.user_id),
          td(item.group_id),
          td(item.joined_at),
        )
      );
    }
  } catch (error) {
    console.log("loadMemberships");
  }
}

export function renderGroupMembership(){

  return div({class:"table-container"},
    h4("Members of Selected Group"),
    table(
      thead(
        tr(
          th("User ID"),
          th("Group ID"),
          th("Joined At"),
        ),
      ),
      tbody({id:"memberships-table"}),
    ),
  )
}