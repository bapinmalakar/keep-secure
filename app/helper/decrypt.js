'use strict';
const crypto = require('crypto');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
const path = require('path');
const configuration = require(path.resolve('environment.js'));
const user = require(path.resolve('app/helper/global.js'));
remote.app.getAppPath();

module.exports = {
    decryptUserInfo: (userDetails) => {
        const decipher = crypto.createDecipher(configuration.ALGORITHM, configuration.AES_KEY);
        let dec = decipher.update(userDetails, 'hex', 'utf8');
        dec += decipher.final('utf8');
        ipcRenderer.send('user-info', JSON.parse(dec));
    },
    decryptUserData: (data) => {
        if (!data) {
            ipcRenderer.send('user-data', []);
            return;
        }
        const decipher = crypto.createDecipher(configuration.ALGORITHM, user.getUserInfo().key)
        let dec = decipher.update(data, 'hex', 'utf8')
        dec += decipher.final('utf8');
        ipcRenderer.send('user-data', JSON.parse(dec));
    }
}