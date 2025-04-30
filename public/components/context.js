/*
  Project Name: minimal_module_js
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/minimal_module_js
*/

/*
  Informtion: Context
*/

import van from "vanjs-core";
import { MessageBoard } from 'vanjs-ui';

const board = new MessageBoard({top: "20px"});
const loginState = van.state(false);
const aliasState = van.state('Guest');
const aliasDataState = van.state({});
const tokenState = van.state({});

const forumIDState = van.state("");
const boardIDState = van.state("");
const topicIDState = van.state("");
const topicTitleState = van.state("");
const topicContentState = van.state("");
const commentIDState = van.state("");
const themeIDState = van.state('light');

export {
  board,
  loginState,
  aliasState,
  aliasDataState,
  tokenState,
  forumIDState,
  boardIDState,
  topicIDState,
  topicTitleState,
  topicContentState,
  commentIDState,
  themeIDState,
}