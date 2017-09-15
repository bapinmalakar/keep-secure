'use strict';
let userInfo;
let userData = [];

module.exports = {
    setUserInfo: (data) => userInfo = data,
    setUserData: (data) => userData = data,
    getUserInfo: () => { return userInfo },
    getUserData: () => { return userData }
}