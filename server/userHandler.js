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

exports.checkId = function (id) {
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
