'use strict';

const crypto = require('crypto');
const remote = require('electron').remote;
remote.app.getAppPath();
const path = require('path');
const configuration = require(path.resolve('environment.js'));

module.exports = {
    encryptUserInfo: (userDetails) => {
        const cipher = crypto.createCipher(configuration.ALGORITHM, configuration.AES_KEY);
        let crypted = cipher.update(userDetails, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    encryptData: (data, key) => {
        const cipher = crypto.createCipher(configuration.ALGORITHM,key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
}