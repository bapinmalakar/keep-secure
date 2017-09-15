'use strict';
const electron = require('electron');
const path = require('path');
const url = require('url');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
remote.app.getAppPath();

module.exports = (pageName, width, height, imageLink) => {
    let win = new BrowserWindow({ width: width, height: height, icon: path.resolve('app/design/images/' + imageLink) });
    win.setResizable(false);
    win.setMenu(null);
    win.setMaximizable(false);
    win.loadURL(url.format({
        pathname: path.resolve('app/pages/' + pageName + '.html'),
        protocol: 'file:',
        slashes: true
    }));
}