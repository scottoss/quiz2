// Imports
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');

// Set initial Variables
var status = "quiz"; // "quiz", "img", "scores"
var number = 33; // Number of the quiz or image
var extra = 1; // Show the answer to the question? 0=no,1=yes,2=img_no,3=img_yes
var question = "Hey."; // Current Quiz Questions
var answer = "Answer"; // Current Quiz Answer

// Dynamic Storage Arrays for Users. Array[0] ist the first user etc.
var uids = []; // Storage for User IDs
var names = []; // Storage for User Names
var score = []; // Storage for User Scores
var active = []; // Whether the User is logged in or not.
var answers = []; // What the Users are typing as an Answer.
var ready = []; // Whether the Users are finished Typing.

// Static Resources
app.use(express.static(path.join(__dirname, 'client')));

// Send HTML for Clients
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'client/layout/login.html'));
});

// Handle Data-Flow
io.on('connection', function(socket){
	// New Connection
	console.log('Connected client');
	
	// Create a new user
	socket.on('newuser', function(n){
		uids.push(socket.id);
		names.push(n);
		score.push(0);
		active.push(1);
		answers.push("");
		ready.push(false);
		let arraynum = names.length - 1;
		socket.emit('registered', arraynum);
		
		// Update User Info
		updateAll();
	});

	// Reconnect
	socket.on('oldUser', function(n){
		uids[n] = socket.id;
		active[n] = 1; // Set User to Active again.
		console.log('Reconnect Function.');
		
		// Update User Info 
		updateAll();
	});

	// Name Handling
	socket.on('refreshUsers', function(){
		// Update Data
		updateAll();
	});

	// Reset Ready of Users in Quiz
	socket.on('resetReady', function(){
		// Send Reset to all Clients
		io.sockets.emit('resetAllReady');
	});

	// Name Handling
	socket.on('setname', function(resname){
		// Set name for UID
		for (i = 0; i < uids.length ; i++) {
			if (uids[i]==socket.id) {
				names[i]=resname;
			}
		}
		
		// Update Data
		updateAll();
	});

	// Add a point to the Score
	socket.on('addScore', function(id){
		score[id]=score[id]+1;
		updateAll();
	});

	// Remove a point to the Score
	socket.on('minScore', function(id){
		score[id]=score[id]-1;
		updateAll();
	});

	// Remove a User completely from the Scores.
	socket.on('removeUser', function(id){
		uids.splice(id, 1);
		names.splice(id, 1);
		score.splice(id, 1);
		active.splice(id, 1);
		answers.splice(id, 1);
		ready.splice(id, 1);
		updateAll();
	});

	// Update Text Input
	socket.on('updateInput', function(a, b){
		// Set name for UID
		for (i = 0; i < uids.length ; i++) {
			if (uids[i]==socket.id) {
				answers[i]=a;
				ready[i]=b;
			}
		}
		updateControlPanel();
	});

	// Request Control Update
	socket.on('requestControlUpdate', function(){
		updateControlPanel();
	});

	// Perform Data Update by Control Panel
	socket.on('updatedata', function(dataObj){
		status = dataObj.st;
		number = dataObj.nu;
		extra = dataObj.ex;
		question = dataObj.qu;
		answer = dataObj.an;
		updateAll();
	});

	// Disconnect Handling
	socket.on('disconnect', function(){
		console.log('Disconnected client');
		for (i = 0; i < uids.length ; i++) {
			if (uids[i]==socket.id) {
				active[i] = 0;
				console.log('Disconnected Handling');
			}
		}
		updateControlPanel();
	});

	// Update Tv on any Change
	updateTv();
});

function updateAll() { updateUsers(); updateTv(); updateControlPanel(); }

// Send all the Data to all the Users
function updateUsers(){
	var scoreObj = {
		status: status,
		number: number, 
		extra: extra, 
		question: question, 
		answer: answer, 
		scores: score
	}
	io.sockets.emit('updateuser', scoreObj);
}

function updateControlPanel() {
	var dataObj = {
		n: names,
		s: score,
		ac: active,
		an: answers,
		r: ready
	}
	io.sockets.emit('updatecontrol', dataObj );
}

function updateTv() {
	var dataObj = {
		// Quiz Info
		st: status,
		nu: number,
		ex: extra,
		qu: question,
		an: answer,
		// User Score Info
		na: names,
		sc: score
	}
	io.sockets.emit('updatetv', dataObj );
}

http.listen(80, function(){
  console.log('listening on *:80');
});
