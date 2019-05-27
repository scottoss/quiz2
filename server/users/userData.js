var uidGenerator = require('rand-token').uid;
let userFile = require('./../../data/users.json');

let users = userFile.users.concat();
initScores();

exports.getUserList = function () {
    let nameList = [];
    users.forEach(u => nameList.push(u.name));
    return nameList;
}

exports.loginUser = function (name, password) {
    let id;
    users.forEach(u => {
        if (name == u.name && password == u.password) {
            id = uidGenerator(16);
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
    let uList = [];
    users.forEach(u => {
        if (u.name != users[0].name) {
            uList.push({
                name: u.name,
                id: u.id,
                input: u.input,
                ready: u.ready,
                score: u.score,
            });
        }
    });
    return uList;
}

exports.updateInput = function (d) {
    users.forEach(u => {
        if (u.id == d.id) u.input = d.input;
    });
}

exports.updateReady = function (d) {
    users.forEach(u => {
        if (u.id == d.id) u.ready = d.ready;
    });
}

exports.resetUserInputs = function () {
    users.forEach(u => {
        u.ready = false;
        u.input = null;
    });
}

exports.addUserScore = function (id) {
    users.forEach(u => {
        if (u.id == id) u.score++;
    });
}

exports.lowerUserScore = function (id) {
    users.forEach(u => {
        if (u.id == id) u.score--;
    });
}

function initScores () {
    users.forEach(u => u.score = 0);
}
