/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

import van from "vanjs-core";
import { ctoggleTheme, toggleTheme } from "../theme/theme.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from '/libs/useFetch.js';
import { themeIDState } from "../context.js";

const {button, div, span, label} = van.tags;

export function AdminNavMenus() {



  return div({ class: "sidebar active" },
    div(
      // toggleTheme(),
      button({ onclick:()=> ctoggleTheme() }, ()=> themeIDState.val === 'light' ? "Theme Light" : "Theme Dark"),
      button({ onclick:()=> navigate("/admin") }, "Home"),
      button({ onclick:()=> navigate("/admin/groups") }, "Groups"),
      button({ onclick:()=> navigate("/admin/permissions") }, "Permissions"),
      button({ onclick:()=> navigate("/admin/logs") }, "Logs"),
      button({ onclick:()=> navigate("/admin/reports") }, "Reports"),
      button({ onclick:()=> navigate('/admin/accounts')},'Accounts'),
      button({ onclick:()=> navigate('/admin/tickets')},'Tickets'),
      button({ onclick:()=> navigate('/admin/database')},'Database'),
      button({ onclick:()=> navigate('/admin/backup')},'Back Up'),
      button({ onclick:()=> navigate('/admin/settings')},'Settings'),
    )
  );
}

export function Header() {
  const isSidebarActive = van.state(true);
  function toggleSidebar() {
    console.log("Toggle...")
    isSidebarActive.val = !isSidebarActive.val;
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      if (isSidebarActive.val) {
        sidebar.classList.add("active");
      } else {
        sidebar.classList.remove("active");
      }
    }
  }

  return div(
    { class: "header" },
    button({ class: "toggle-btn", onclick: toggleSidebar }, "☰"),
    div({ class: "logo" }, "Admin Panel"),
    div({ class: "user-profile" }, "User")
  );
}