/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

// import { THREE, ECS, van } from "/dps.js";
import van from "vanjs-core";
import { toggleTheme } from "../theme/theme.js";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from '/libs/useFetch.js';
import { AdminNavMenus, Header } from "./admin_layout.js";

const {button, div, span, label, input, select, option, textarea,
  table,
  thead,
  tr,
  td,
  tbody
} = van.tags;

//BUTTON MODAL
function createButtonFormTicket(){
  const isCreated = van.state(false);
  function btnCreateFormTricket(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createFormTicket({closed:isCreated})
    ));
  }

  return button({class:"normal",onclick:()=>btnCreateFormTricket()},"Create Ticket");
}

// CREATE REPORT FORUM
function createFormTicket({closed}){

  const formTitle = van.state('test');
  const formDescription = van.state('test');
  const formResourceType = van.state('general');
  const formResourceId = van.state('');
  const formCategory = van.state('general');
  
  async function btnRequestTicket(){
    console.log("create report form");
    console.log(formTitle.val);
    console.log(formDescription.val);
    console.log(formResourceType.val);
    console.log(formResourceId.val);
    console.log(formCategory.val);
    try{
      const data = await useFetch('/api/ticket',{
        method:'POST',
        body:JSON.stringify({
          title:formTitle.val,
          description:formDescription.val,
          resource_type:formResourceType.val,
          resource_id:formResourceId.val,
          category:formCategory.val,
        })
      });
      console.log(data);
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e)
    }
  }

  return div({id:'createReportForm', class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Title:"),
      input({value:formTitle,oninput: e => formTitle.val = e.target.value, type:"text",placeholder:"Enter Report Title"}),
    ),
    div({class:"form-group"},
      label({class:"report-type"},"Resource Type:"),
      select({value:formResourceType,oninput: e => formResourceType.val = e.target.value,},
        option({value:"general"},"General"),
        option({value:"forum"},"Forum"),
        option({value:"board"},"Board"),
        option({value:"topic"},"Topic"),
        option({value:"comment"},"Comment"),
      )
    ),
    div({class:"form-group"},
      label({class:"report-type"},"Resource ID:"),
      input({type:"number",value:formResourceId,oninput: e => formResourceId.val = e.target.value,})
    ),
    div({class:"form-group"},
      label({class:"report-type"},"Category:"),
      select({value:formCategory,oninput: e => formCategory.val = e.target.value,},
        option({value:"bug"},"Bug"),
        option({value:"feature"},"Feature"),
        option({value:"improvement"},"Improvement"),
        option({value:"support"},"Support"),
      )
    ),
    div({class:"form-group"},
      label({class:"report-content"},"Content:"),
      textarea({value:formDescription,oninput: e => formDescription.val = e.target.value,placeholder:"Enter report details"}),
    ),

    div({class:"form-group"},
      button({class:"normal",onclick:btnRequestTicket},'Create'),
      button({class:"warn",onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

function pageTickets() {

  const ticketList = tbody();

  async function cCloseTicket(id){
    try {
      const data = await useFetch(`/api/ticket/${id}`,{
        method:'PUT',
        body:JSON.stringify({
          status:'close',
        })
      });  
    } catch (error) {
      console.log("error:",error.message);
    }
  }

  async function cDeleteTicket(id){
    try {
      const data = await useFetch(`/api/ticket/${id}`,{
        method:'DELETE'
      });
      console.log(data);
    } catch (error) {
      console.log("error:",error.message);
    }
  }

  async function getFetchTickets(){
    try {
      const data = await useFetch(`/api/ticket`);
      console.log(data);
      for(const ticket of data){
        van.add(ticketList,
          tr({id:ticket.id},
            td(ticket.title),
            td(ticket.status,
              button({onclick:()=>cCloseTicket(ticket.id)},'Close')
            ),
            td(ticket.created_at),
            td(
              button({onclick:()=>cDeleteTicket(ticket.id)},'Delete')
            ),
          )
        )
      }
    
    } catch (error) {
      console.log("error: ", error.message)
    }
  }

  getFetchTickets();

  return div(
    { class: "container" },
    Header(),
    AdminNavMenus(),
    div({ class: "admin-content" }, 
      label("Tickets Page"),
      div(
        createButtonFormTicket()
      ),
      table(
        thead(
          tr(
            td("Name"),
            td("Status"),
            td("Created At"),
            td("Actions"),
          )
        ),
        ticketList
      )
    )
  );
}

export default pageTickets;