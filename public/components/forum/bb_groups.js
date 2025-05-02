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
    return div({class:"form-container"},
      h3("Add Group"),
      div({class:"group-form-alert"}),
      div({id:"group-form"},
        div({class:"mb-3"},
          label("Group Name"),
          input({id:"name",value:groupName,oninput:(e)=>groupName.val=e.target.value})
        ),
        div({class:"mb-3"},
          label("Description"),
          textarea({id:"description",value:groupDescription,oninput:(e)=>groupDescription.val=e.target.value}),
        ),
        button({type:"submit",onclick:btnAddGroup},"Add Group")
      ),
    );
  }

  function renderFormGroupMembership(){
    return div({class:"form-container"},
      h3("Manage Group Membership"),
      div({class:"form-container"},
        div({id:"membership-form-alert", class:"alert"}),
        form({id:"group-form"},
          div({class:"mb-3"},
            label("Group"),
            select({id:"group_id"},
              option("Select Group")
            ),
          ),
          div({class:"mb-3"},
            label("User ID"),
            input({id:"user_id"}),
          ),
          button({type:"submit"},"Add Membership"),
          button({type:"submit"},"Remove Membership"),
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
            td(button({onclick:()=>loadMemberships(item.id)},"View Members")),
          )
        );
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