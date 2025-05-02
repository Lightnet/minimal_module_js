import van from "vanjs-core";
import { Modal } from "vanjs-ui";

import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "../../libs/useFetch.js";
const {button, i, input, label,textarea, link, div, span, h2, h3, h4, p, form, select, option, table, tbody, thead, tr, th, td  } = van.tags;

export function pageForumGroups() {

  function renderFormGroups(){
    return div({class:"form-container"},
      h3("Add Group"),
      div({class:"group-form-alert"}),
      form({id:"group-form"},
        div({class:"mb-3"},
          label("Group Name"),
          input({id:"name"},)
        ),
        div({class:"mb-3"},
          label("Description"),
          textarea({id:"description"}),
        ),
        button({type:"submit"},"Add Group")
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
      for(const item of data){
        van.add(_tbody,
          tr(
            td(item.id),
            td(item.name),
            td(item.description ),
            td(item.created_at),
            td(button({},"View Members")),
          )
        )
      }

    } catch (error) {
      console.log("loadGroups error!");
    }
  }

  async function loadMemberships(groupId) {
    const url = groupId ? `/groups/memberships?groupId=${groupId}` : `/api/groups/memberships`;
    try {
      const data = await useFetch(url);
      const _tbody = document.getElementById('memberships-table');
      for(const item of data){
        van.add(_tbody,
          tr(
            td(item.user_id),
            td(item.group_id),
            td(item.joined_at),
          )
        )
      }

    } catch (error) {
      
    }

  }

  setTimeout(()=>{
    loadGroups();
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