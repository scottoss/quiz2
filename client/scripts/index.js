// Imports
var socket = io();

// Set initial Variables
var status = "none"; // "quiz", "img", "scores"
var number = 0; // Number of the quiz or image
var extra = 0; // Show the answer to the question? 0=no,1=yes,2=img_no,3=img_yes
var question = ""; // Current Quiz Questions
var answer = ""; // Current Quiz Answer
var myScore = 0; // Current Score
var name = ""; // Current Username

// Create a new User (1. New Name, 2. Send Data)
function newUser(){
	var r = 0;
	while (r == 0) { // Repeat the Dialog when Canceled
		var nameinput = prompt("Vorname, Nachname-Kürzel", "");
		if (nameinput !== null && nameinput !== ""){
			sessionStorage.name = nameinput;
			socket.emit('setname', nameinput);
			r = 1;
		}
	}
	socket.emit('newuser', nameinput);
}

// Set Name of User
function promptName(){
	var r = 0;
	while (r == 0) { // Repeat the Dialog when Canceled
		var nameinput = prompt("Vorname, Nachname-Kürzel", "");
		if (nameinput !== null){
			sessionStorage.name = nameinput;
			socket.emit('setname', nameinput);
			r = 1;
		}
	}
}

// Write HTML
function updateHtml(){
	document.querySelector('#score').innerHTML = sessionStorage.name + ": " + myScore;
	document.querySelector('#question').innerHTML = question;
	if (extra==1) { document.querySelector('#answer').innerHTML = answer; } else { document.querySelector('#answer').innerHTML = ""; }
}

// Send TextInput + Ready
function updateInput(){
	socket.emit('updateInput', document.querySelector('#answerBox').value, document.querySelector('#cbtest').checked);
}

// What to Do, when the client connected.
socket.on('connect', function(){
	if (sessionStorage.name == null) {
		// When there is no saved Data, create a new Connection
		newUser();
	} else {
		// Whenever the user refreshes the page, he is able to use his last Account again.
		var r = confirm("Press OK to continue playing as: " + sessionStorage.name);
		if (r == true) {socket.emit('oldUser', sessionStorage.id);} else {newUser();}
	}
});

// Get back the ID after creating a new user
socket.on('registered', function(lastid){
	sessionStorage.id = lastid;
});

// Get back the ID after creating a new user
socket.on('resetAllReady', function(){
	document.querySelector('#cbtest').checked = false;
	updateInput();
});

// Update User-Data
socket.on('updateuser', function(data){
	// Write Variables
	status = data.status;
	number = data.number;
	extra = data.extra;
	question = data.question;
	answer = data.answer;
	myScore = data.scores[sessionStorage.id];
	// Apply Changes
	updateHtml();
});

