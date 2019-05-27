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

io.of('/').on('connection', function (socket) {

	console.log('Connected client');	

	loginHandler.login(socket);
	loginHandler.validation(socket);
	loginHandler.userList(socket);

	socket.on('disconnect', function(){
		console.log('Disconnected client');
	});

});

io.of('/users').on('connection', function (socket) {

	loginHandler.validation(socket);
	userHandler.pageUpdates(socket);
	userHandler.input(socket);

});

io.of('/master').on('connection', function (socket) {

	loginHandler.validation(socket);
	masterHandler.pageUpdates(socket);
	masterHandler.controls(socket);
	masterHandler.scores(socket);

});

http.listen(80, function(){
  console.log('listening on *:80');
});
