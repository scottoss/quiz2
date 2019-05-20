// Imports
var socket = io();

// Set initial Variables
var status = "none"; // "quiz", "img", "scores"
var number = 0; // Number of the quiz or image
var extra = 0; // Show the answer to the question? 0=no,1=yes,2=img_no,3=img_yes
var question = ""; // Current Quiz Questions
var answer = ""; // Current Quiz Answer

// Set inital Scores
var names = [];
var scores = [];

function updateHtml() {
	if (status=="quiz") {
		document.body.innerHTML = "<h3 id=number></h3><h1 id=question></h1><h2 id=answer></h2><table id=scoretable></table>";
		document.querySelector('#number').innerHTML = "Nr. " + number;
		document.querySelector('#question').innerHTML = question;
		if (extra==1) { document.querySelector('#answer').innerHTML = answer; }
		InsertScores();
	} else if (status=="img") {
		document.body.innerHTML = "<img src=/" + number + "></img>";
	} else if (status=="scores") {
		document.body.innerHTML = "<table id=scoretable></table>"
		InsertScores();
	}
}

// Add Scores
function InsertScores() {
	document.getElementById("scoretable").innerHTML = null;
	var table = document.getElementById("scoretable");
	var row1 = table.insertRow(0);
	var row2 = table.insertRow(1);
	
	for (i = 0; i < names.length ; i++) {
		var currentCell = row1.insertCell(i);
		currentCell.innerHTML = "<h3 class=stname>" + names[i] + "</h3>";
	}
	for (i = 0; i < scores.length ; i++) {
		var currentCell = row2.insertCell(i);
		currentCell.innerHTML = "<p style=font-size:40px>"+ scores[i] + "</p>";
	}
}

// Receive Data Object from Server and save it
socket.on('updatetv', function(dataObj){
	names = dataObj.na;
	scores = dataObj.sc;
	status = dataObj.st;
	number = dataObj.nu;
	extra = dataObj.ex;
	question = dataObj.qu;
	answer = dataObj.an;
	
	updateHtml();
});
