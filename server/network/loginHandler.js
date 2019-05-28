const userData = require('../users/userData');
const masterHandler = require('./masterHandler');

// Login for getting a Session Token
exports.login = function (socket) {

    socket.on('loginUser', function(data){
		let token = userData.loginUser(data.name, data.password);
		if (token) {
			socket.emit('loginSuccess', { token: token, isMaster: userData.checkMaster(token) });
			masterHandler.updateUserInfo();
		} else {
			socket.emit('loginFailed');
		}
	});

}

// Validate Login Token and enter Namespace
exports.validation = function (socket) {

	socket.on('validateToken', function(token) {
        if (userData.validateToken(token) == true) {
			
			userData.saveSocket(token, socket.id);
            socket.emit('validationSuccess', userData.checkMaster(token));
            
		} else {
			userData.saveSocket(token, '');
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
