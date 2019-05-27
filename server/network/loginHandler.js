const userData = require('../users/userData');
const masterHandler = require('./masterHandler');

// Login for getting a Session Token
exports.login = function (socket) {

    socket.on('loginUser', function(data){
		let id = userData.loginUser(data.name, data.password);
		if (id) {
			socket.emit('loginSuccess', { id: id, isMaster: userData.checkMaster(id) });
			masterHandler.updateUserInfo();
		} else {
			socket.emit('loginFailed');
		}
	});

}

// Validate Login Token and enter Namespace
exports.validation = function (socket) {

	socket.on('validateToken', function(token) {
        if (userData.validateId(token) == true) {
            
            socket.emit('validationSuccess', userData.checkMaster(token));
            
		} else {
			socket.emit('validationFailed');
		}
	});

}

// Used to get all possible user names
exports.userList = function (socket) {

    socket.on('getUserList', function () {
        socket.emit('getUserList', userData.getUserList());
    });

}
