const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const [path, url, fs] = [require('path'), require('url'), require('fs')];
const configure = require(path.resolve('./environment.js'));
const notification = require(path.resolve('./app/notification.js'));

let userInfo;
let userData = [];
function init() {
    if (check()) {
        console.log('Go to login Page');
        createWindow.loginWindow();
    }
    if (!check()) {
        console.log('Signup page');
        createWindow.signupWindow();
    }
}
function check() {
    if (fs.existsSync(configure.USER_INFO_FILENAME)) {
        let data = fs.readFileSync(configure.USER_INFO_FILENAME, 'utf8').toString().trim();
        if (!data)
            return false;
        return true;
    }
    else
        return false;
}

let createWindow = {
    loginWindow: () => {
        let win = new BrowserWindow({ width: 570, height: 250, icon: path.resolve('./app/design/images/login.png') });
        win.setMenu(null);
        win.setMaximizable(false);
        win.setResizable(false);
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/pages/login.html'),
            protocol: 'file:',
            slashes: true
        }));
    },
    signupWindow: () => {
        let win = new BrowserWindow({ width: 800, height: 500, icon: path.resolve('./app/design/images/signup.png') });
        win.setMenu(null);
        win.setMaximizable(false);
        win.setResizable(false);
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/pages/signup.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
}

ipcMain.on('error-message', (event, args) => {
    console.log('ERROR');
    notification.errNotify(args.err);
})

ipcMain.on('user-info', (event, args) => {
    console.log('User info: ', args);
    userInfo = args;
});

ipcMain.on('user-data', (event, args) => {
    console.log('User Data', args);
    userData = args;
});

ipcMain.on('send-user-info', (event, args) => {
    event.sender.send('receive-user-info', userInfo);
});

ipcMain.on('send-user-data', (event, args) => {
    event.sender.send('receive-user-data', userInfo);
})
ipcMain.on('success-message', (event, args) => notification.successNotify(args));
ipcMain.on('close-app', (event,args)=> {
    app.quit();
});
module.exports = {
    userInfo: () => { return userInfo },
    userData: () => { return userData }
};
app.on('ready', init);