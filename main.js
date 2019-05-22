// Imports
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');
var userHandler = require('./server/userHandler');
var quizHandler = require('./server/quizHandler');

// Static Resources
app.use(express.static(path.join(__dirname, 'client')));

// Send HTML for Clients
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/login.html'));
});
app.get('/quiz', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/quiz.html'));
});
app.get('/master', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/master.html'));
});

// Handle Data-Flow
io.on('connection', function(socket){
	// New Connection
	console.log('Connected client');
	
	// Login Page Logic
	socket.on('getUserList', function(){
		socket.emit('getUserList', userHandler.getUserList());
	});

	socket.on('userLogin', function(userData){
		let id = userHandler.loginUser(userData.name, userData.password);
		if (id) {
			// userHandler.setSocketId(id, socket.id); // Save socket
			socket.emit('loginSuccess', { id: id, isMaster: userHandler.checkMaster(id) });
			updateMasterUsers();
		} else {
			socket.emit('loginFailed');
		}
	});

	// Quiz Page Login Handling
	socket.on('validateLogin', function(userId) {
		if (userHandler.validateId(userId) == true) {
			// userHandler.setSocketId(userId, socket.id); // Save socket
			socket.emit('validateSuccess', userHandler.checkMaster(userId));
			updateUserPage(socket, userId);
		} else {
			socket.emit('validationFailed');
		}
	});

	// Updates
	socket.on('requestUpdate', function (id) {
		if (userHandler.checkMaster(id) == true) {
			socket.emit('masterQuiz', quizHandler.getQuiz());
			socket.emit('masterUsers', userHandler.getMasterInfo());
		}
		updateUserPage(socket, id);
	});
	socket.on('requestUserUpdate', function (id) {
		if (userHandler.checkMaster(id) == true) {
			socket.emit('masterUsers', userHandler.getMasterInfo());
		}
	});

	socket.on('userInput', function (d) {
		userHandler.updateInput(d);
		updateMasterUsers();
	});

	socket.on('userReady', function (d) {
		userHandler.updateReady(d);
		updateMasterUsers();
	});

	// Master Controls
	socket.on('nextQuestion', function () {
		quizHandler.changeQuestion(1);
		io.emit('resetInput');
		updateAll();
	});
	socket.on('lastQuestion', function () {
		quizHandler.changeQuestion(-1);
		io.emit('resetInput');
		updateAll();
	});
	socket.on('addScore', function (id) {
		userHandler.addUserScore(id);
		updateMasterUsers();
	});
	socket.on('lowerScore', function (id) {
		userHandler.lowerUserScore(id);
		updateMasterUsers();
	});

	// Disconnect Handling
	socket.on('disconnect', function(){
		console.log('Disconnected client');
	});
});

http.listen(80, function(){
  console.log('listening on *:80');
});

function updateUserPage (socket, userId) {
	socket.emit('pageUpdate', quizHandler.getPageInfo(userId));
}

function updateAll() {
	io.emit('notifyUpdate');
}

function updateMasterUsers() {
	io.emit('notifyMasterUpdate');
}
