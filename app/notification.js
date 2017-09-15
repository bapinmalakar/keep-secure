'use strict'
const notification = require('node-notifier');
const remote = require('electron').remote;
const path = require('path');

let notice = {
    errNotify: (err) => {
        notification.notify({
            title: 'Error Notification',
            message: err,
            icon: path.resolve('app/design/images/erroricon.png'),
            sound: true,
            wait: true
        }, (err, response) => console.log('Notification error'))
    },
    successNotify: (msg) => {
        notification.notify({
            title: 'Successfully Completed',
            message: msg,
            icon: path.resolve('app/design/images/success.png'),
            sound: true,
            wait: true
        });
    }
}

module.exports = notice;