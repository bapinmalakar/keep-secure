'use strict';
const $ = require('jquery');
const remote = require('electron').remote;
const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;
remote.app.getAppPath();
const path = require('path');
const fs = require('fs');
const env = require(path.resolve('environment.js'));
const encrypt = require(path.resolve('app/helper/encrypt.js'));
const decrypt = require(path.resolve('app/helper/decrypt.js'));
const validation = require(path.resolve('app/scripts/validation.js'));
const pageCall = require(path.resolve('app/scripts/pageCall.js'));

let taskToDo = '';
let userInfo;
let userData = [];

let addFormValid = [false, false, false, false];
let viewForm = [];

$(document).ready(() => {
    ipcRenderer.send('send-user-info', '');
});
$('#addClick').on('click', () => {
    consoleShow(true, true);
    clearConsole(true, true);
    consoleShow(false, false);
    displayDiv(true);
});
$('#addFormCancel').on('click', () => $('#addForm').hide());
$('#addFormClear').on('click', () => {
    clearAddForm();
    consoleShow(false, true);
    clearConsole(false, true);
    consoleSetMsg(false, '', true, '<div><h2>From is Cleared</h2></div>');
});
$('#addFormSave').on('click', () => {
    clearConsole(false, true);
    consoleShow(true, false);
    if ($('#account_name').val() == '') {
        checkAndAppend('#console #errorConsole #errName', 'Account Name Required', 'errName');
        addFormValid[0] = false;
    }
    else if (!validation.accountNameValidation($('#account_name').val())) {
        checkAndAppend('#console #errorConsole #errName', 'Account Name Only Contain Alphabate and Number! And name must be unique', 'errName');
        addFormValid[0] = false;
    } else {
        let nam = $('#account_name').val();
        if (findIndex(nam) != -1) {
            alert(findIndex(nam));
            checkAndAppend('#console #errorConsole #errName', 'Account name must be unique', 'errName');
            addFormValid[0] = false;
        } else {
            deletErrTag('#console #errorConsole #errName');
            addFormValid[0] = true;
        }
    }
    if ($('#account_userid').val() == '') {
        checkAndAppend('#console #errorConsole #errUserid', 'Enter userid to save', 'errUserid');
        addFormValid[1] = false;
    }
    else {
        deletErrTag('#console #errorConsole #errUserid');
        addFormValid[1] = true;
    }
    if ($('#account_password').val() == '') {
        checkAndAppend('#console #errorConsole #errPass', 'Type account password', 'errPass');
        addFormValid[2] = false;
    }
    else {
        deletErrTag('#console #errorConsole #errPass');
        addFormValid[2] = true;
    }

    if ($('#account_url').val() != '' && !validation.urlValidation($('#account_url').val())) {
        checkAndAppend('#console #errorConsole #errUrl', 'Enter valid website URL', 'errUrl');
        addFormValid[3] = false;
    }
    else if ($('#account_url').val() == '' || ($('#account_url').val() != '' && validation.urlValidation($('#account_url').val()))) {
        deletErrTag('#console #errorConsole #errUrl');
        addFormValid[3] = true;
    }

    if ((addFormValid.filter(d => d == false)).length <= 0) {
        userData.push({
            name: $('#account_name').val().trim(),
            userid: $('#account_userid').val().trim(),
            password: $('#account_password').val(),
            url: $('#account_url').val().trim()
        });
        let saveData = encrypt.encryptData(JSON.stringify(userData), userInfo.key);
        fs.writeFileSync(env.USER_PASSWORD_FILE, saveData);
        accountList();
        addFormValidReset();
        clearConsole(true, true);
        consoleShow(false, true);
        consoleSetMsg(false, '', true, '<div><h2>Data Successfully Saved!</h2></div>')
    }
});
$('.glyphicon-eye-close').on('click', () => {
    $('#addFormPassView i').removeClass('glyphicon-eye-close');
    $('#addFormPassView i').addClass('glyphicon-eye-open');
    $('#account_password').attr('type', 'text');
    setTimeout(() => {
        $('#addFormPassView i').removeClass('glyphicon-eye-open');
        $('#addFormPassView i').addClass('glyphicon-eye-close');
        $('#account_password').attr('type', 'password');
    }, 7000);
});
$('#account_list').on('click', 'ul li', (e) => {
    consoleShow(true, true);
    clearConsole(true, true);
    consoleShow(false, false);
    if ($('#editForm').is(':visible'))
        editDivLoad(e);
    else {
        displayDiv(false, false, true);
        editDivLoad(e);
    }
    alert('Done');
})
$('#lockClick').on('click', () => {
    userData = [];
    ipcRenderer.send('user-info', {});
    const window = remote.getCurrentWindow();
    pageCall('login', 570, 250, 'login.png');
    window.close();
})
$('#quitClick').on('click', () => {
    alert('click');
    ipcRenderer.send('close-app', '');
});
$('#editFormPassView .glyphicon').on('click', (e) => {
    if ($(e.target).hasClass('glyphicon-eye-close')) {
        taskToDo = 'showPass';
        verifyAlertShow();
    }
    else {
        $(e.target).removeClass('glyphicon-eye-open');
        $(e.target).addClass('glyphicon-eye-close');
        $('#edit_password').attr('type', 'password');
    }
});
$('#editFormDelete').on('click', () => {
    let option = confirm('Are you want to delete?');
    if (option == true) {
        taskToDo = 'deleteRecord';
        verifyAlertShow();
    }
})
$('#verify .close .verifyClose').on('click', () => {
    verifyAlertHide();
    taskToDo = '';
});
$('#verifyPasswordBtn').on('click', () => {
    if (verifyUser()) {
        verifyAlertHide();
        performTask();
    }
});
$('#editFormSave').on('click', () => {
    addFormValidReset();
    clearConsole(false, true);
    consoleShow(true, false);
    addFormValid[0] = true;
    if ($('#edit_userid').val() == '') {
        checkAndAppend('#console #errorConsole #errId', 'Enter account userid', 'errId');
        addFormValid[1] = false;
    }
    else {
        deletErrTag('#console #errorConsole #errId');
        addFormValid[1] = true;
    }
    if ($('#edit_password').val() == '') {
        checkAndAppend('#console #errorConsole #errPass', 'Enter account password', 'errPass');
        addFormValid[2] = false;
    }
    else {
        deletErrTag('#console #errorConsole #errPass');
        addFormValid[2] = true;
    }
    if ($('#edit_url').val() == '') {
        deletErrTag('#console #errorConsole #errUrl');
        addFormValid[3] = true;
    }
    else if ($('#edit_url').val() != '' && !validation.urlValidation($('#edit_url').val())) {
        checkAndAppend('#console #errorConsole #errUrl', 'Enter valid URL', 'errPass');
        addFormValid[3] = false;
    }
    else {
        deletErrTag('#console #errorConsole #errUrl');
        addFormValid[3] = true;
    }

    if (addFormValid.filter(d => d == false).length <= 0) {
        const txt = $('#edit_name').val();
        if (findIndex(txt) != -1 && confirm('Are you sure for update?')) {
            taskToDo = "editRecord";
            verifyAlertShow();
        }
    }
});
$('#editFormCancel').on('click', () => {
    consoleShow(true, true);
    clearConsole(true, true);
    consoleShow(false, false);
    displayDiv(false, true, false);
});
$('#changePassBtn').on('click', () => {
    $('nav,#bodyDiv').addClass('blur');
    $('#changePassword').show(10, changePasswordInit);
});
$('.passwordClose a').on('click', () => {
    $('nav,#bodyDiv').removeClass('blur');
    $('#changePassword').hide();
});
$('.passBtn .clear').on('click', () => {
    changePasswordInit();
});
$('.passBtn .change').on('click', () => {
    if ($('.passClass.old').val() == '')
        $('.passErr.old').text('Type current password');
    else if (!validation.passwordValidation($('.passClass.old').val()))
        $('.passErr.old').text('Type valid password');
    else
        $('.passErr.old').text('');

    if ($('.passClass.new').val() == '')
        $('.passErr.new').text('Type new password');
    else if (!validation.passwordValidation($('.passClass.new').val()))
        $('.passErr.new').text('Type valid password');
    else
        $('.passErr.new').text('');

    if ($('.passClass.con').val() == '')
        $('.passErr.con').text('Re-type new password');
    else if (!validation.passwordValidation($('.passClass.con').val()) || $('.passClass.con').val() != $('.passClass.new').val())
        $('.passErr.con').text('Not match with new password');
    else
        $('.passErr.con').text('');
    if (['.passErr.old', '.passErr.new', '.passErr.con'].filter(d => $(d).text() == '').length == 3) {
        if (userInfo.password == $('.passClass.old').val()) {
            $('.passErr.old').text('');
            userInfo.password = $('.passClass.new').val();
            const txt = encrypt.encryptUserInfo(JSON.stringify(userInfo));
            fs.writeFileSync(env.USER_INFO_FILENAME, txt);
            ipcRenderer.send('user-info', userInfo);
            alert('Password Update Successfully!');
            $('nav,#bodyDiv').removeClass('blur');
            $('#changePassword').hide();
        }
        else
            $('.passErr.old').text('Current password not match');
    }
});
$('#changeKeyBtn').on('click', () => {
    taskToDo = "chnageKey";
    verifyAlertShow();
});
$('#keyChange .body a').on('click', () => {
    if ($('#keyChange .body .add').val() == '')
        $('#keyChange .body .verifyError').text('Enter new key for encryption');
    else if (!validation.encryptkeyValidation($('#keyChange .body .add').val()))
        $('#keyChange .body .verifyError').text('Key should be mis of letter, number and special character and 12 character long');
    else {
        $('#keyChange .body .verifyError').text('');
        taskToDo = '';
        userInfo.key = $('#keyChange .body .add').val();
        if (userData.length) {
            const userDatat = encrypt.encryptData(JSON.stringify(userData), userInfo.key);
            fs.writeFileSync(env.USER_PASSWORD_FILE, userDatat);
        }
        let encInfo = encrypt.encryptUserInfo(JSON.stringify(userInfo));
        fs.writeFileSync(env.USER_INFO_FILENAME, encInfo);
        ipcRenderer.send('user-info', userInfo);
        $('nav, #bodyDiv').removeClass('blur');
        $('#keyChange').hide();
        alert('Key update successfully!');
    }

});
$('#keyChange .close a').on('click', () => {
    taskToDo = '';
    $('#keyChange').hide();
    $('nav, #bodyDiv').removeClass('blur');
});
$('#exportCode').on('click', () => {
    if (confirm('Are you sure?')) {
        taskToDo = "exportFile";
        verifyAlertShow();
    }
});
$('#openUrl').on('click', ()=>{
    alert(navigator.onLine);
})

function findIndex(txt) {
    return userData.findIndex(d => d.name == txt);
}//Find index of object in user data
function editDivLoad(e) {
    const txt = $(e.target).text();
    const obj = (userData.filter(d => d.name == txt))[0];
    if (obj) {
        loadEditData(obj);
    }
}// function to load edit div
function loadEditData(obj) {
    $('#edit_name').val(obj.name);
    $('#edit_userid').val(obj.userid);
    $('#edit_password').val(obj.password);
    $('#edit_url').val(obj.url);
    $('#editFormSave b').text('  Edit');
}//function to load data in edit div
function clearAddForm() {
    ['#account_name', '#account_userid', '#account_password', '#account_url'].map(d => $(d).val(''));
}//function to clear add form
function consoleShow(error, success) {
    if (error)
        $('#console #errorConsole').show();
    if (success)
        $('#console #appStatus').show();
}// function show/decide in console div
function consoleSetMsg(error, errMsg, succ = false, succMsg = '') {
    if (error)
        $('#console #errorConsole').append(errMsg);
    if (succ)
        $('#console #appStatus').append(succMsg);
}//function to set message in console div(err, success);
function clearConsole(error, succ) {
    if (error)
        $('#console #errorConsole').empty();
    if (succ)
        $('#console #appStatus').empty();
}//function to clear console div element
function initFun() {
    if (fs.existsSync(env.USER_PASSWORD_FILE)) {
        let data = fs.readFileSync(env.USER_PASSWORD_FILE, 'utf8').toString().trim();
        if (data == '' || !data) userData = [];
        else userData = JSON.parse(decrypt.decryptUserData(data, userInfo.key));
        accountList();
    }
    else $('#account_list #emptyList').show();
}// initialize the window
function accountList() {
    if (userData.length <= 0) {
        $('#account_list #emptyList').show();
        $('#account_list ul').hide();
    }
    else {
        $('#account_list #emptyList').hide();
        $('#account_list ul').show();
        $('#account_list ul').empty();
        for (let item of userData)
            $('#account_list ul').append('<li>' + item.name + '</li>');
    }

}//lisiting the account are saved
function checkAndAppend(checkid, appentText, id) {
    if ($(checkid).length > 0)
        $(checkid + ' h6').text(appentText)
    else
        consoleSetMsg(true, '<div id="' + id + '"><h6>' + appentText + '</h6></div>');

}//check div is present or not then append or update in console

function deletErrTag(checkid) {
    if ($(checkid).length > 0)
        $(checkid).remove();
}//delete a particular div from console div
function addFormValidReset() {
    for (let i = 0; i < 4; i++)
        addFormValid[i] = false;
}//reset valid array as false
function displayDiv(addForm = false, headingDiv = false, editDiv = false) {
    if (addForm) {
        $('#heading').hide();
        $('#editForm').hide();
        $('#addForm').show();
    }
    else if (headingDiv) {
        $('#editForm').hide();
        $('#addForm').hide();
        $('#heading').show();
    }
    else if (editDiv) {
        $('#addForm').hide();
        $('#heading').hide();
        $('#editForm').show();
    }
}// display main 3div decision
function verifyAlertShow() {
    $('#verify').show(verifyDivInit);
    $('nav, #bodyDiv').addClass('blur');
}//instance password check alert show
function verifyAlertHide() {
    $('#verify').hide();
    $('nav, #bodyDiv').removeClass('blur');
}//instance password check alert hide
function verifyUser() {
    if ($('#verifyPassword').val() == '') {
        $('.verifyError').text('Password required');
        return false;
    }
    if (!validation.passwordValidation($('#verifyPassword').val()) || $('#verifyPassword').val() != userInfo.password) {
        $('.verifyError').text('Enter valid password');
        return false;
    }
    if ($('#verifyPassword').val() == userInfo.password) {
        $('#verifyPassword').val('');
        $('.verifyError').text('');
        return true;
    }
}// verify user enter password in instace password check alert
function performTask() {
    if (taskToDo) {
        if (taskToDo == 'showPass') {
            $('#editFormPassView .glyphicon').removeClass('glyphicon-eye-close ');
            $('#editFormPassView .glyphicon').addClass('glyphicon-eye-open');
            $('#edit_password').attr('type', 'text');
            taskToDo = '';
            return;
        }
        if (taskToDo == 'deleteRecord') {
            let txt = $('#edit_name').val();
            let index = findIndex(txt);
            if (index != -1) {
                userData.splice(index, 1);
                ['#edit_name', '#edit_userid', '#edit_password', '#edit_url'].map(d => $(d).val(''));
                if ($('#editFormPassView .glyphicon').hasClass('glyphicon-eye-open')) {
                    $('#editFormPassView .glyphicon').removeClass('glyphicon-eye-open');
                    $('#editFormPassView .glyphicon').addClass('glyphicon-eye-close');
                    $('#edit_password').attr('type', 'password');
                }
                $('#account_list ul').empty();
                accountList();
                if (userData.length <= 0) {
                    fs.writeFileSync(env.USER_PASSWORD_FILE, '');
                    displayDiv(false, true, false);
                } else {
                    if ((userData.length - 1) >= index)
                        loadEditData(userData[index]);
                    else
                        loadEditData(userData[index - 1]);
                    fs.writeFileSync(env.USER_PASSWORD_FILE, encrypt.encryptData(JSON.stringify(userData), userInfo.key));
                }
                consoleShow(true, true);
                clearConsole(true, true);
                consoleShow(false, true);
                consoleSetMsg(false, '', true, '<div><h2>Data Successfully Deleted!</h2></div>')
            }
            taskToDo = '';
            return;
        }
        if (taskToDo == "editRecord") {
            const txt = $('#edit_name').val();
            const index = findIndex(txt);
            if (index != -1) {
                userData[index].userid = $('#edit_userid').val();
                userData[index].password = $('#edit_password').val();
                userData[index].url = $('#edit_url').val();
                fs.writeFileSync(env.USER_PASSWORD_FILE, encrypt.encryptData(JSON.stringify(userData), userInfo.key));
                consoleShow(true, true);
                clearConsole(true, true);
                consoleShow(false, true);
                consoleSetMsg(false, '', true, '<div><h2>Account Successfully Updated</h2></div>');
                taskToDo = '';
            }
        }
        if (taskToDo == "chnageKey") {
            $('nav, #bodyDiv').addClass('blur');
            $('#keyChange').show(10, changeKeyInit);
        }
        if (taskToDo == 'exportFile') {
            if (userData.length) {
                dialog.showSaveDialog({filters: [{
                    name: 'text',
                    extensions: ['txt']
                }]}, (filename) => {
                    if (filename == null) {
                        alert('Invalid file name');
                        taskToDo = '';
                        return false;
                    }
                    alert(filename);
                    let str = '';
                    userData.map(d => {
                        str += 'Account Name: ' + d.name + '\n\tUserid: ' + d.userid + '\n\t Password: ' + d.password + '\n\tUrl: ' + d.url + '\n\n';
                    });
                    fs.writeFile(filename, str, (err) => {
                        if (err)
                            alert('Not able to create that file!');
                        else
                            alert('All data are saved!');
                    });
                    taskToDo = '';
                });
            }
            else {
                alert("You don't have any data to export");
                taskToDo = '';
            }

        }
    }
}// after instance verify perform task that user want
function verifyDivInit() {
    $('#verify .body #verifyPassword').val('');
    $('#verify .body .verifyError').text('');
}//init fun for instance verify alert
function changePasswordInit() {
    $('.passClass').val('');
    $('.passErr').text('');
}//Init change password alert
function changeKeyInit() {
    $('#keyChange .body .add').val('');
    $('#keyChange .body .verifyError').text('');
}//inut
ipcRenderer.on('receive-user-info', (event, args) => {
    userInfo = args;
    initFun();
    $('#userName').text((userInfo.fname + ' ' + userInfo.lname).toUpperCase());
    displayDiv(false, true, false);
}).bind(this);

// function readUserData(){

// }
