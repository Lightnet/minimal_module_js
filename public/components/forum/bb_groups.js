import van from "vanjs-core";
import { Modal } from "vanjs-ui";

import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "../../libs/useFetch.js";
const {button, i, input, label,textarea, link, div, span, h2, h3, h4, p, form, select, option, table, tbody, thead, tr, th, td  } = van.tags;

export function pageForumGroups() {
  const groupName = van.state('');
  const groupDescription = van.state('');

  function renderFormGroups(){
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
        button({type:"submit",onclick:btnAddGroup},"Add Group")
      )
    );
  }

  const userId = van.state('');
  const groupId = van.state('');

  async function btnAddGroupMembership(){
    console.log("userId:", userId.val);
    console.log("groupId:", groupId.val);
    const jsonData = {
      userId:parseInt(userId.val, 10),
      groupId:parseInt(groupId.val, 10),
    }

    try {
      const data = await useFetch(`/api/groups/membership`,{
        method: 'POST',
        body: JSON.stringify(jsonData),
      });
      console.log(data);
      loadMemberships(groupId.val);
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

  async function btnRemoveMGroupMembership(){
    console.log("userId:", userId.val);
    console.log("groupId:", groupId.val);
    const jsonData = {
      userId:parseInt(userId.val, 10),
      groupId:parseInt(groupId.val, 10),
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

  function renderFormGroupMembership(){
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
            button({onclick:btnAddGroupMembership},"Add Membership"),
            button({onclick:btnRemoveMGroupMembership},"Remove Membership"),
          ),
      ),
    );
  }

  function renderGroupMembership(){
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
        })
      }
    }

  }


  const isDeleteGroupModal = van.state(false);
  function btnRemoveGroupId(id, name){
    isDeleteGroupModal.val=false;
    van.add(document.body, Modal({closed:isDeleteGroupModal},div(
      label(`Delete Group: ${name} (ID:${id})`),
      button({onclick:()=>{fetch_delete_groupid(id)}},"Delete"),
      button({onclick:()=>{isDeleteGroupModal.val=true}},"Cancel"),
    )));
  }

  function renderGroupsTable(){
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
        tbody({id:"groups-table"}),
      ),
    );
  }

  async function loadGroups() {

    

    try {
      const data = await useFetch('/api/groups');
      console.log(data);
      const _tbody = document.getElementById('groups-table');
      const groupSelect = document.getElementById('group_id');
      console.log(groupSelect);

      for(const item of data){
        van.add(_tbody,
          tr(
            td(item.id),
            td(item.name),
            td(item.description ),
            td(item.created_at),
            td(
              button({onclick:()=>loadMemberships(item.id)},"View Members"),
              button({onclick:()=>btnRemoveGroupId(item.id,item.name)},"Delete")
            ),
          )
        );

        //SELECT for options
        van.add(groupSelect,
          option({value:item.id}, `${item.name} (ID:${item.id})`)
        );
        // console.log("test....");
      }

    } catch (error) {
      console.log("loadGroups error!");
    }
  }

  async function loadMemberships(groupId) {
    const url = groupId ? `/api/groups/memberships/${groupId}` : `/api/groups/memberships`;
    try {
      const data = await useFetch(url);
      const _tbody = document.getElementById('memberships-table');
      console.log("data:", data);
      
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
    } catch (error) {
      console.log("Faill to add group");
    }
  }

  setTimeout(()=>{
    loadGroups();
    // loadMemberships();
  },100);

  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbForumNav,
      div({class:"forum-main"},
        renderFormGroups(),
        renderGroupsTable(),
        renderFormGroupMembership(),
        renderGroupMembership(),
      )
    ),
  );
}