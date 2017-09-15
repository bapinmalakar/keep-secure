'use strict';
const $ = require('jquery');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
remote.app.getAppPath();
const path = require('path');
const fs = require('fs');
let userInfo;
let userData = [];
$(document).ready(() => {
    ipcRenderer.send('send-user-info', '');
});

ipcRenderer.on('receive-user-info', (event, args) => {
    userInfo = args;
    $('#userName').text((userInfo.fname + ' ' + userInfo.lname).toUpperCase());
});

// function readUserData(){
    
// }

