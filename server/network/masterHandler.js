// Libraries / Frameworks
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Other Modules
const userData = require('../users/userData');
const quizData = require('../quiz/quizData');

exports.pageUpdates = function (socket) {

	socket.on('requestUpdate', function (token) {
		if (userData.checkMaster(token) == true) {
			socket.emit('masterQuiz', quizData.getQuiz());
            socket.emit('masterUsers', userData.getMasterInfo());
		}
    });

	socket.on('requestUserUpdate', function (token) {
		if (userData.checkMaster(token) == true) {
            socket.emit('masterUsers', userData.getMasterInfo());
		}
	});

}

exports.scores = function (socket) {
	socket.on('addScore', function (token) {
		userData.addUserScore(token);
		module.exports.updateUserInfo();
	});
	socket.on('lowerScore', function (token) {
		userData.lowerUserScore(token);
		module.exports.updateUserInfo();
	});
}

exports.controls = function (socket) {

	socket.on('nextQuestion', function () {
		userData.resetUserInputs();
		quizData.changeQuestion(1);
		io.emit('resetInput');
		updateAll();
	});
	socket.on('lastQuestion', function () {
		userData.resetUserInputs();
		quizData.changeQuestion(-1);
		io.emit('resetInput');
		updateAll();
	});
	socket.on('showAnswers', function (isRevealed) {
		quizData.revealAnswer(isRevealed);
		updateAll();
    });

}

exports.updateUserInfo = function () {
	io.emit('masterUsers', userData.getMasterInfo());
}

function updateAll() {
	io.emit('notifyUpdate');
}
