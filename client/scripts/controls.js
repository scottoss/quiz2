// Imports
var socket = io();

// Dynamic Storage Arrays for Users. Array[0] ist the first user etc.
var names = []; // Storage for User Names
var score = []; // Storage for User Scores
var active = []; // Whether the User is logged in or not.
var answers = []; // What the Users are typing as an Answer.
var ready = []; // Whether the Users are finished Typing.

// Send a request to Server, that refreshes all Users Data
function refreshUsers() {
	socket.emit('refreshUsers');
}

function initData() { socket.emit('requestControlUpdate'); }

function minScore(id) { socket.emit('minScore', id); }

function addScore(id) { socket.emit('addScore', id); }

function removeUser(id) { socket.emit('removeUser', id); }

function resetReady() { socket.emit('resetReady'); }

function submitData() {
	var dataObj = {
		st: document.querySelector('#tvStatus').value,
		nu: document.querySelector('#tvNumber').value,
		ex: document.querySelector('#tvExtra').value,
		qu: document.querySelector('#tvQuestion').value,
		an: document.querySelector('#tvAnswer').value
	}
	socket.emit('updatedata', dataObj);
}

// Refresh Table with Data
function InsertScores() {
	var table = document.getElementById("scoreTable");
	table.innerHTML = "";
	
	// Static Header Row
	var row = table.insertRow(0);
	var currentCell = row.insertCell(0); currentCell.innerHTML = "<b class=header>X</b>";
	var currentCell = row.insertCell(1); currentCell.innerHTML = "<b class=header>Name</b>";
	var currentCell = row.insertCell(2); currentCell.innerHTML = "<b class=header>-</b>";
	var currentCell = row.insertCell(3); currentCell.innerHTML = "<b class=header>Score</b>";
	var currentCell = row.insertCell(4); currentCell.innerHTML = "<b class=header>+</b>";
	var currentCell = row.insertCell(5); currentCell.innerHTML = "<b class=header>Online</b>";
	var currentCell = row.insertCell(6); currentCell.innerHTML = "<b class=header>Antwort</b>";
	var currentCell = row.insertCell(7); currentCell.innerHTML = "<b class=header>Ready</b>";
	
	// Dynamic Content
	for (i = 0; i < names.length ; i++) {
		var row = table.insertRow(i + 1);
		
		for (c = 0; c < 8 ; c++) { // Name, Score, Active, Answer, Ready
			switch (c) {
				case 0:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = "<img src=cancel.png onclick=removeUser("+i+")></img>";
					break;
				case 1:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = "<b>" + names[i] + "</b>";
					break;
				case 2:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = "<img src=minus.png onclick=minScore("+i+")></img>";
					break;
				case 3:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = score[i];
					break;
				case 4:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = "<img src=plus.png onclick=addScore("+i+")></img>";
					break;
				case 5:
					var currentCell = row.insertCell(c);
					if (active[i]==1) {
						currentCell.innerHTML = "<img src=wifi.png></img>";
					} else { currentCell.innerHTML = "<img src=nowifi.png></img>"; }
					break;
				case 6:
					var currentCell = row.insertCell(c);
					currentCell.innerHTML = answers[i];
					break;
				case 7:
					var currentCell = row.insertCell(c);
					if (ready[i]==true) {
						currentCell.innerHTML = "<img src=checkedbox.png></img>";
					} else { currentCell.innerHTML = "<img src=emptybox.png></img>"; }
					break;
			}
		}
	}
}

// Refresh Data from all Inputs
socket.on('updatecontrol', function(dataObj){
	console.log('Received Control-Center Update');
	names = dataObj.n; // Storage for User Names
	score = dataObj.s; // Storage for User Scores
	active = dataObj.ac; // Whether the User is logged in or not.
	answers = dataObj.an; // What the Users are typing as an Answer.
	ready = dataObj.r; // Whether the Users are finished Typing.
	
	
	
	
	InsertScores();
});

// Update User-Data and interpret
socket.on('updateuser', function(data){
	// Write HTML
	document.querySelector('#serverQuestion').innerHTML =  data.question;
	document.querySelector('#serverAnswer').innerHTML =  data.answer;
	document.querySelector('#serverNumber').innerHTML =  "Nr. " + data.number;
});