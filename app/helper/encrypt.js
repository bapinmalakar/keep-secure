'use strict';

const crypto = require('crypto');
const remote = require('electron').remote;
remote.app.getAppPath();
const path = require('path');
const configuration = require(path.resolve('environment.js'));
const user = require(path.resolve('app/helper/global.js'));

module.exports = {
    encryptUserInfo: (userDetails) => {
        const cipher = crypto.createCipher(configuration.ALGORITHM, configuration.AES_KEY);
        let crypted = cipher.update(userDetails, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    encryptData: (data) => {
        const cipher = crypto.createCipher(configuration.ALGORITHM, user.getUserInfo().key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
}