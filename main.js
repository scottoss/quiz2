// Libraries / Frameworks
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');

// Custom Modules
var loginHandler = require('./server/network/loginHandler');
var userHandler = require('./server/network/userHandler');
var masterHandler = require('./server/network/masterHandler');
const userData = require('./server/users/userData');

// Assign io() var in Submodules
masterHandler.io = io;

// ExpressJS Configuration
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/login.html'));
});
app.get('/quiz', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/quiz.html'));
});
app.get('/master', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/master.html'));
});

io.on('connection', function (socket) {

	console.log('Connected client');	

	loginHandler.login(socket);
	loginHandler.validation(socket);
	loginHandler.userList(socket);

	userHandler.pageUpdates(socket);
	userHandler.input(socket);

	masterHandler.pageUpdates(socket);
	masterHandler.controls(socket);
	masterHandler.scores(socket);

	socket.on('disconnect', function(){
		userData.removeSocket(socket.id);
		console.log('Disconnected client');
	});

});

http.listen(80, function(){
  console.log('listening on *:80');
});
