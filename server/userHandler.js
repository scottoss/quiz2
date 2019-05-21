var uidGen = require('rand-token').uid;
let userFile = require('../quiz/users.json');

let users = userFile.users;

exports.getUserList = function () {
    let nameList = [];
    users.forEach(u => nameList.push(u.name));
    return nameList;
}

exports.loginUser = function (name, password) {
    let id;
    users.forEach(u => {
        if (name == u.name && password == u.password) {
            id = uidGen(16);
            u.id = id;
        }
    });
    return id;
}

exports.validateId = function (id) {
    let success = false;
    users.forEach(u => {
        if (u.id == id) success = true;
    });
    return success;
}

exports.getUserById = function (id) {
    let gotUser = {};
    users.forEach(u => {
        if (u.id == id) gotUser = u;
    });
    return gotUser;
}

exports.checkMaster = function (id) {
    if (users[0].id == id) return true;
    return null;
}

exports.getMasterInfo = function () {
    let uList = users.slice(0);
    uList.splice(0, 1);
    uList.forEach(u => {
        delete u.password;
    });
    return uList;
}

exports.resetUserInputs = function () {

}

/*
exports.setSocketId = function (userId, socketId) {
    users.forEach(u => {
        if (u.id == userId) u.socketId = socketId;
    });
}
*/
