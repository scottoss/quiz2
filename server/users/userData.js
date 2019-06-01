var tokenGenerator = require('rand-token').uid;
let userFile = require('./../../data/users.json');

let users = userFile.users.concat();
initUsers();

exports.getUserData = function () {
    return users;
}

exports.getUserList = function () {
    let nameList = [];
    users.forEach(u => nameList.push(u.name));
    return nameList;
}

exports.loginUser = function (name, password) {
    let token;
    users.forEach(u => {
        if (name == u.name && password == u.password) {
            token = tokenGenerator(16);
            u.token = token;
        }
    });
    return token;
}

exports.validateToken = function (token) {
    let success = false;
    users.forEach(u => {
        if (u.token == token) success = true;
    });
    return success;
}

exports.getUserByToken = function (token) {
    let gotUser = {};
    users.forEach(u => {
        if (u.token == token) gotUser = u;
    });
    return gotUser;
}

exports.checkMaster = function (token) {
    if (users[0].token == token) {
        return true;
    } else {
        return false;
    }
}

exports.getMasterInfo = function () {
    let uList = [];
    users.forEach(u => {
        if (u.name != users[0].name) {
            uList.push({
                name: u.name,
                token: u.token,
                input: u.input,
                ready: u.ready,
                score: u.score,
                jokers: u.jokers,
                activeJoker: u.activeJoker,
            });
        }
    });
    return uList;
}

exports.updateInput = function (d) {
    users.forEach(u => {
        if (u.token == d.token) u.input = d.input;
    });
}

exports.updateReady = function (d) {
    users.forEach(u => {
        if (u.token == d.token) u.ready = d.ready;
    });
}

exports.resetUserInputs = function () {
    users.forEach(u => {
        u.ready = false;
        u.input = null;
    });
}

exports.addUserScore = function (token) {
    users.forEach(u => {
        if (u.token == token) u.score++;
    });
}

exports.lowerUserScore = function (token) {
    users.forEach(u => {
        if (u.token == token) u.score--;
    });
}

function initUsers () {
    users.forEach(u => {
        u.score = 0;
        u.jokers = [];
    });
}

exports.saveSocket = function (token, socketId) {
    users.forEach(u => { 
        if (u.token == token) u.socketId = socketId;
    });
}

exports.getSocket = function (token) {
    users.forEach(u => { 
        if (u.token == token) return u.socketId;
    });
    return;
}

exports.getMasterSocket = function () {
    return users[0].socketId;
}

exports.removeSocket = function (socketId) {
    users.forEach(u => {
        if (u.socketId == socketId) u.socketId = null;
    });
}

exports.addJoker = function (token, jokerType) {
    users.forEach(u => {
        if (u.token == token) {
            u.jokers.push(jokerType);
        }
    });
}

exports.useJoker = function (token, jokerType) {
    let isUsed = false;
    users.forEach(u => {
        if (u.token == token) {
            if (u.activeJoker == "" || u.activeJoker == null) {
                for (i = 0; i < u.jokers.length; u++) {
                    if (u.jokers[i] == jokerType) {
                        isUsed = true;
                        u.activeJoker = u.jokers[i];
                        u.jokers.splice(i, 1);
                        break;
                    }
                }
            }
        }
    });
    if (isUsed == true) {
        return true;
    } else {
        return;
    }
}

exports.clearJokers = function () {
    users.forEach(u => {
        u.activeJoker = null;
    });
}
