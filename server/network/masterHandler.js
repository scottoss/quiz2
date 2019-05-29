// Other Modules
const userData = require('../users/userData');
const quizData = require('../quiz/quizData');
exports.io;

exports.pageUpdates = function (socket) {

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
		module.exports.io.emit('resetInput');
		updateAll();
	});
	socket.on('lastQuestion', function () {
		userData.resetUserInputs();
		quizData.changeQuestion(-1);
		module.exports.io.emit('resetInput');
		updateAll();
	});

	socket.on('showAnswers', function (isRevealed) {
		quizData.revealAnswer(isRevealed);
		updateAll();
	});

	socket.on('changeStatus', function (newStatus) {
		if (newStatus == "next") {
			userData.resetUserInputs();
			quizData.changeQuestion(1);
			module.exports.io.emit('resetInput');
			quizData.changeStatus("question");
			updateAll();
		} else {
			quizData.changeStatus(newStatus);
			updateAll();
		}
  });

}

exports.updateUserInfo = function () {
	let masterSocket = userData.getMasterSocket();
	if (masterSocket) module.exports.io.to(masterSocket).emit('masterUsers', userData.getMasterInfo());
}

function updateAll() {
	let users = userData.getUserData();
	users.forEach(u => {
		if (u.socketId) {
			if (userData.checkMaster(u.token)) {
				module.exports.io.to(u.socketId).emit('masterQuiz', quizData.getQuiz());
				module.exports.io.to(u.socketId).emit('masterUsers', userData.getMasterInfo());
			} else {
				module.exports.io.to(u.socketId).emit('pageUpdate', quizData.getPageInfo(u.token));
			}
		}
	});
}
