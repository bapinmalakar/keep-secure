'use strict';
const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
remote.app.getAppPath();
const validation = require(path.resolve('app/scripts/validation.js'));
const pageCall = require(path.resolve('app/scripts/pageCall.js'));
const decryptHelper = require(path.resolve('app/helper/decrypt.js'));
const configuration = require(path.resolve('environment.js'));
const user = require(path.resolve('app/helper/global.js'));
const [userid, pass, errUser, errPass] = [$('#userid'), $('#password'), $('#errId'), $('#errPass')];
let password, useremail;

function clear() {
    userid.val('');
    pass.val('');
    errPass.text('');
    errUser.text('');
}
$(document).ready(() => {
    clear();
})

$('#loginBtn').on('click', () => {
    loginFunction();
})

pass.on('keyup', (e) => {
    if (e.keyCode == 13)
        loginFunction();
})
function changeText(txt) {
    $('#loginBtn').text(txt);
}
function loginFunction() {
    changeText('Processing...');
    if (!userid.val()) {
        errUser.text('Userid required');
        notify('Valid user id please');
        changeText('Login');
        return false;
    }
    if (!validation.emailValidation(userid.val())) {
        errUser.text('Enter valid userid');
        notify('Valid user id please');
        changeText('Login');
        return false;
    }
    if (validation.emailValidation(userid.val()))
        errUser.text('');
    if (!pass.val()) {
        errPass.text('Password reqired');
        notify('Invalid password');
        changeText('Login');
        return false;
    }
    if (!validation.passwordValidation(pass.val())) {
        errPass.text('Enter valid password');
        notify('Invalid password');
        changeText('Login');
        return false;
    }
    if (validation.passwordValidation(pass.val()))
        errPass.text('');
    password = pass.val();
    useremail = userid.val().trim();
    if (fs.existsSync(configuration.USER_INFO_FILENAME)) {
        let data = fs.readFileSync(configuration.USER_INFO_FILENAME, 'utf8').toString().trim();
        if (!data) {
            alert('Error in application setup, uninstall app and reinstall again');
            ipcRenderer.send('error-message',{err: 'Error in application setup, uninstall app and reinstall again'});
            changeText('Login');
            return false;
        }
        decryptHelper.decryptUserInfo(data);
        ipcRenderer.send('send-user-info', '');
    }
    else {
        alert('Error in application setup, uninstall app and reinstall again');
        ipcRenderer.send('error-message',{err: 'Error in application setup, uninstall app and reinstall again'});
        changeText('Login');
    }
}

ipcRenderer.on('receive-user-info', (event, args) => {
    if (useremail == args.email) {
        if (password == args.password) {
            user.setUserInfo(args);
            changeText('Login');
            ipcRenderer.send('success-message', 'Authenticate user');
            let window = remote.getCurrentWindow();
            pageCall('home', 900,700, 'project.png');
            window.close();
        }
        else {
            errPass.text('Invalid Password');
            notify('Unauthorized User');
            changeText('Login');
        }
    }
    else {
        errUser.text('Invalid userid');
        changeText('Login');
        notify('Unauthorized User');
    }
});

function notify(err) {
    ipcRenderer.send('error-message', { type: 'error', err: err });
}

