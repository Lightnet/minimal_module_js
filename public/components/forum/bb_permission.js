
import van from "vanjs-core";
import { Modal } from "vanjs-ui";

import { Color } from "../notify/notifycontext.js";
import { notify } from "../notify/notify.js";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "../../libs/useFetch.js";
const {button, i, input, label,textarea, link, div, span, h2, h3, p, form, select, option, table, tbody, thead, tr, th, td  } = van.tags;

export function pageForumPermissions() {

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
            option({vaule:item.id},item.name)
          )
        }
        console.log(data);
      }catch (error) {
        //showAlert('Failed to load groups', 'danger');
        console.log("Failed to load groups");
      }

    }
  }

  async function loadPermissions() {
    try {
      const data = await useFetch('/api/permissions');
      console.log("data: ", data);
      const _tbody = document.getElementById('permissions-table');
      for(let item of data){
        van.add(_tbody,
          tr(
            td(item.id),
            td(item.entity_type),
            td(item.entity_id),
            td(item.resource_type),
            td(item.resource_id || '-'),
            td(item.action),
            td(item.allowed ? 'Yes' : 'No'),
          )
        )
      }

    }catch (error) {
      //showAlert('Failed to load permissions', 'danger');
      console.log("Failed to load permissions");
    }
  }

  function renderForm(){
    return div({class:"form-container"},
      h3("Add Permission"),
      div({id:"form-alert",class:"alert",role:"alert"}),
      form({id:"permission-form"},
        div({class:"mb-3"},
          label("Entity Type: "),
          select({id:"entity_type"},
            option({value:"role"}, "Role"),
            option({value:"group"}, "Group"),
          )
        ),
        div({class:"mb-3"},
          label("Entity ID: "),
          select({id:"entity_id"})
        ),
        div({class:"mb-3"},
          label("Resource Type: "),
          select({id:"resource_type"},
            option({value:"forum"}, "Forum"),
            option({value:"board"}, "Board"),
            option({value:"topic"}, "Topic"),
            option({value:"comment"}, "Comment"),
            option({value:"user"}, "User"),
            option({value:"group"}, "Group"),
          )
        ),
        div({class:"mb-3"},
          label("Resource ID (Optional): "),
          input({id:"resource_id"}),
        ),
        div({class:"mb-3"},
          label("Action: "),
          select({id:"action"},
            option({value:"create"}, "Create"),
            option({value:"read"}, "Read"),
            option({value:"update"}, "Update"),
            option({value:"delete"}, "Delete"),
            option({value:"manage"}, "Manage"),
          )
        ),
        div({class:"mb-3 form-check"},
          input({type:"checkbox",checked:true}),
          label("Allowed")
        ),
        button({},"Add Permission")
      )
    )
  }

  function renderPermissionTable(){
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
          ),
        ),
        tbody({id:"permissions-table"})
      )
    )
  }

  // Initial load
  setTimeout(()=>{
    console.log("fetch...")
    updateEntityIdOptions();
    loadPermissions();
    document.getElementById('entity_type').addEventListener('change', updateEntityIdOptions);
  },100);
  
  return div({id:"forum",class:"forum-container" },
    HomeNavMenu(),
    div({class:"main-content"},
      // bbForumNav,
      div({class:"forum-main"},
        renderForm(),
        renderPermissionTable(),
      )
    ),
  );

}