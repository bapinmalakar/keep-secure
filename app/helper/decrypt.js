'use strict';
const crypto = require('crypto');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
const path = require('path');
const configuration = require(path.resolve('environment.js'));
remote.app.getAppPath();

module.exports = {
    decryptUserInfo: (userDetails) => {
        const decipher = crypto.createDecipher(configuration.ALGORITHM, configuration.AES_KEY);
        let dec = decipher.update(userDetails, 'hex', 'utf8');
        dec += decipher.final('utf8');
        ipcRenderer.send('user-info', JSON.parse(dec));
    },
    decryptUserData: (data, key) => {
        const decipher = crypto.createDecipher(configuration.ALGORITHM, key)
        let dec = decipher.update(data, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}