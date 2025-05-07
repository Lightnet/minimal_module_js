/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

//import { van } from "/dps.js";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterParams,getRouterPathname, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "../../libs/useFetch.js";
// import { pageState } from "../context.js";

const {div, button, h1, label, input, select, option} = van.tags;

export function addPage(id){
  const isCreated = van.state(false);
  van.add(document.body, Modal({closed:isCreated},
    createFormPage({closed:isCreated,id:id})
  ));
}

export function viewPage(){

}

export function pageBooks(){

  const books = div();

  async function fetchBooks(){
    try {
      const data = await useFetch('/api/books');
      console.log(data);

      for(const item of data){
        van.add(books,
          div(
            label(`Name: ${item.title} `),
            button({onclick:()=>addPage(item.id)},"Add Page"),
            button({onclick:()=>navigate(`/book/${item.id}/page/1`)},"View Page")
          )
        )
      }

      if(closed){
        closed.val = true;
      }
    } catch (error) {
      console.log("ERROR",error.message)
    }
  }

  fetchBooks();

  return div({id:"book"},
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Books"),
      ),
      div({class:"ccontent"},
        label('Book'),
        // El_CreateMessageForm(),
        // messagesDiv
        btnCreateBook(),
        books,
      ),
    ),
  );
}

export function pageBook(){

  const bookPage = div();
  const selectPage = van.state('')

  const _bookId = van.state(null);
  const _pageNumber = van.state(0);

  van.derive(async ()=>{
    const {bookid, page } = getRouterParams();
    console.log(typeof bookid);
    console.log(typeof page);
    if(typeof bookid === 'string' && typeof page === 'string'){
      console.log("FOUND... BOOK PAGE...");
      await fetchBookPage(bookid, page);
    }
  })

  function onChangePage(e){
    console.log("[onChangePage] e.target.value: ", e.target.value)
    selectPage.val = e.target.value;
    navigate(`/book/${_bookId.val}/page/${e.target.value}`);
  }

  async function getPagesNumber(bookId) {
    try {
      const data = await useFetch(`/api/books/${bookId}/pages`);
      console.log(data);
      if(data){
        
        const selectTop = document.getElementById('book-page-select-top');
        const selectBottom = document.getElementById('book-page-select-bottom');
        while(selectTop.firstChild){
          selectTop.removeChild(selectTop.firstChild);
        }
        while(selectBottom.firstChild){
          selectBottom.removeChild(selectBottom.firstChild);
        }
        for(let idx = 1; idx < data.pages+1; idx++){
          van.add(selectTop,
            option({value:idx}, `Page ${idx}`)
          )
          van.add(selectBottom,
            option({value:idx}, `Page ${idx}`)
          )
        }
      }
    } catch (error) {
      
    }
  }

  async function fetchBookPage(bookid, page){
    try {
      _bookId.val = bookid;
      const data = await useFetch(`/api/books/${bookid}/pages/${page}`);
      console.log(data);
      while(bookPage.firstChild){
        bookPage.removeChild(bookPage.firstChild);
      }

      van.add(bookPage,
        div({class:"book-nav-buttons"},
          button({onclick:()=>{
            if(data.prev_page!=null){//if null do not run
              navigate(`/book/${data.book_id}/page/${data.prev_page}`);
            }
          }},()=> data.prev_page ? "Previous" : "x"),
          select({id:"book-page-select-top",class:"book-page-select",value:selectPage,onchange:onChangePage}),
          button({onclick:()=>{
            if(data.next_page!=null){
              console.log("PRESS ONE?")
              navigate(`/book/${data.book_id}/page/${data.next_page}`);
            }
          }},()=> data.next_page ? "Next" : "x")
        ),
        div({style:"min-height:400px;"},
          `${data.content} `
        ),
        div({class:"book-nav-buttons"},
          button({onclick:()=>{
            if(data.prev_page!=null){//if null do not run
              navigate(`/book/${data.book_id}/page/${data.prev_page}`);
            }
          }},()=> data.prev_page ? "Previous" : "x"),
          select({id:"book-page-select-bottom",class:"book-page-select"}),
          button({onclick:()=>{
            if(data.next_page!=null){
              console.log("PRESS ONE?")
              navigate(`/book/${data.book_id}/page/${data.next_page}`);
            }
          }},()=> data.next_page ? "Next" : "x")
        ),
      )
      getPagesNumber(bookid);
      setTimeout(()=>{
        console.log("page:", page);
        document.getElementById('book-page-select-top').value = page;
        document.getElementById('book-page-select-bottom').value = page;
      },10)
    } catch (error) {
      console.log("ERROR",error.message)
    }
  }

  return div({id:"book"},
    HomeNavMenu(),
    div({class:"main-content"},
      div({class:"cheader"},
         h1("Books"),
      ),
      div({class:"ccontent"},
        label('Book'),
        bookPage,
      ),
    ),
  );
}

export function btnCreateBook(){
  const isCreated = van.state(false);

  function cCreateFormBook(){
    van.add(document.body, Modal({closed:isCreated},
      createFormBook({closed:isCreated})
    ));
  }
  
  return button({onclick:()=>cCreateFormBook()},`Create Book`);
}

function createFormBook({closed}){
  const formTitle = van.state('test title');
  const formDescription = van.state('test description');

  async function btnFetchCreateForum(){
    try {
      const data = await useFetch('/api/books',{
        method:'POST',
        body:JSON.stringify({
          title: formTitle.val,
          description: formDescription.val,
        })
      });
      console.log(data);
      if(closed){
        closed.val = true;
      }
    } catch (error) {
      console.log("ERROR",error.message)
    }
  }

  return div({id:'pm',class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Title:"),
      input({type:"text",value:formTitle, oninput:e=>formTitle.val=e.target.value}),
    ),
    div({class:"form-group"},
      label({class:"report-title"},"Description:"),
      input({type:"text",value:formDescription, oninput:e=>formDescription.val=e.target.value}),
    ),
    div({class:"form-group"},
      button({class:"normal", onclick:btnFetchCreateForum},'Send'),
      button({class:"warn", onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}

function createFormPage({closed,id}){
  const formiD = van.state(id);//book id
  const formContent = van.state('test formContent');

  async function btnFetchCreatePage(){
    try {
      const data = await useFetch(`/api/books/${formiD.val}/pages`,{
        method:'POST',
        body:JSON.stringify({
          book_id: formiD.val,
          content: formContent.val,
        })
      });
      console.log(data);
      if(closed){
        closed.val = true;
      }
    } catch (error) {
      console.log("ERROR",error.message)
    }
  }

  return div({id:'pm',class:"ccontent"},
    div({class:"form-group"},
      label({class:"report-title"},"Book ID:"),
      input({type:"text",value:formiD, oninput:e=>formiD.val=e.target.value,disabled:true}),
    ),
    div({class:"form-group"},
      label({class:"report-title"},"Content:"),
      input({type:"text",value:formContent, oninput:e=>formContent.val=e.target.value}),
    ),
    div({class:"form-group"},
      button({class:"normal", onclick:btnFetchCreatePage},'Send'),
      button({class:"warn", onclick:()=>closed.val=true},'Cancel'),
    ),
  );

}