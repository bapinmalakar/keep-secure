'use strict'
const nameRegx = new RegExp("^[a-zA-Z]+$");
const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
remote.app.getAppPath();
const configure = require(path.resolve('environment.js'));
const encrypt = require(path.resolve('app/helper/encrypt.js'));
const keyRegx = /(?=.*[@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\? ]+?).*[^_\W]+?.*/;
const emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegx = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const accountRegx = new RegExp("^[a-zA-Z0-9]+$");

let validation = {
    nameValidation: (name) => {
        return nameRegx.test(name);
    },
    emailValidation: (email) => {
        return emailRegx.test(email);
    },
    passwordValidation: (password) => {
        if (keyRegx.test(password)) {
            if (password.length >= 6)
                return true;
        }
        return false;
    },
    cpasswordValidation: (cpass, pass) => {
        return (cpass == pass) ? true : false;
    },
    encryptkeyValidation: (key) => {
        if (keyRegx.test(key)) {
            if (key.length >= 12)
                return true;
        }
        return false;
    },
    accountNameValidation: (accountName) => {
        return accountRegx.test(accountName);
    },
    urlValidation: (url) => {
        return (url.match(urlRegx) == null ? false : true);
    },
    saveInfo(obj) {
        let data = encrypt.encryptUserInfo(JSON.parse(obj));
        fs.writeFileSync(configure.USER_INFO_FILENAME, data);
    }
}

module.exports = validation;