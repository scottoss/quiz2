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

// Handle Data-Flow
io.on('connection', function(socket){
	// New Connection
	console.log('Connected client');
	
	// Login Page Logic
	socket.on('getUserList', function(){
		socket.emit('getUserList', userHandler.getUserList());
	})

	socket.on('userLogin', function(userData){
		let id = userHandler.loginUser(userData.name, userData.password);
		if (id) {
			socket.emit('loginSuccess', id);
		} else {
			socket.emit('loginFailed');
		}
	})

	// Quiz Page Login Handling
	socket.on('validateLogin', function(userId) {
		if (userHandler.checkId(userId) == true) {
			socket.emit('validateSuccess');
			updateUserPage(socket, userId);
		} else {
			socket.emit('validationFailed');
		}
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
