'use strict';
const $ = require('jquery');
const { BrowserWindow } = require('electron');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
const appPath = remote.app.getAppPath();
const [path, fs] = [require('path'), require('fs')];
const validation = require(path.resolve('app/scripts/validation.js'));
const pageCall = require(path.resolve('app/scripts/pageCall.js'));
alert('ooo');
//All Input Field Id
const [pass, cpass, email, fname, lname, key, errPass, errCPass, errEmail, errFName, errLName, errKey] =
    [$('#password'), $('#cpassword'), $('#email'), $('#fname'), $('#lname'), $('#ekey'), $('#errpass'), $('#errcpass'), $('#erremail'), $('#errfname'), $('#errlname'), $('#errencryp')];
$(document).ready(() => {
    clearAllField();
})

function errNotify() {
    ipcRenderer.send('error-message', { type: 'save', err: 'Please propery fillup the information' });
}
$('#initializeBtn').on('click', () => {
    //first name
    if (fname.val() == '') {
        errFName.text('First name required');
        errNotify();
        return false;
    }
    if (!validation.nameValidation(fname.val())) {
        errFName.text('First name only contain alphabte!');
        errNotify();
        return false;
    }
    if (validation.nameValidation(fname.val()))
        errFName.text('');

    //last name
    if (lname.val() == '') {
        errLName.text('Last name required');
        errNotify();
        return false;
    }
    if (!validation.nameValidation(lname.val())) {
        errLName.text('Last name only contain alphabate');
        errNotify();
        return false;
    }
    if (validation.nameValidation(lname.val()))
        errLName.text('');

    //email
    if (email.val() == '') {
        errEmail.text('Email required');
        errNotify();
        return false;
    }
    if (!validation.emailValidation(email.val())) {
        errEmail.text('Invalid email');
        errNotify();
        return false;
    }
    if (validation.emailValidation(email.val()))
        errEmail.text('')

    //key
    if (key.val() == '') {
        errKey.text('Key Required');
        errNotify();
        return false;
    }
    if (!validation.encryptkeyValidation(key.val())) {
        errKey.text('key should be like min length 12, combination of digit alphabate, special character');
        errNotify();
        return false;
    }
    if (validation.encryptkeyValidation(key.val()))
        errKey.text('');

    //Password
    if (pass.val() == '') {
        errPass.text('Password required');
        errNotify();
        return false;
    }
    if (!validation.passwordValidation(pass.val())) {
        errPass.text('Password should be like: length minimum 6,combination of digit,alphabate,special character');
        errNotify();
        return false;
    }
    if (validation.passwordValidation(pass.val()))
        errPass.text('');

    //Confirm password
    if (cpass.val() == '') {
        errCPass.text('Confirm password required');
        errNotify();
        return false;
    }
    if (!validation.cpasswordValidation(cpass.val(), pass.val())) {
        errCPass.text('Password not match');
        errNotify();
        return false;
    }
    if (validation.cpasswordValidation(cpass.val(), pass.val()))
        errCPass.text('');

    let obj = {
        fname: fname.val().trim().toUpperCase(),
        lname: lname.val().trim().toUpperCase(),
        email: email.val().trim(),
        key: key.val(),
        password: pass.val()
    }
    validation.saveInfo(obj);
    ipcRenderer.send('success-message', 'App initialized successfully');
    let window = remote.getCurrentWindow();
    pageCall('home');
    window.close();
})

function clearAllField() {
    pass.val('');
    cpass.val('');
    email.val('');
    fname.val('');
    lname.val('');
    key.val('');
    errPass.text('');
    errCPass.text('');
    errEmail.text('');
    errFName.text('');
    errLName.text('');
    errKey.text('');
}