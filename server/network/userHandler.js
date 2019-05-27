const masterHandler = require('./masterHandler');
const userData = require('../users/userData');
const quizData = require('../quiz/quizData');

exports.pageUpdates = function (socket) {

	socket.on('requestUpdate', function (id) {
		if (userData.checkMaster(id) == true) {
			socket.emit('masterQuiz', quizHandler.getQuiz());
			socket.emit('masterUsers', userHandler.getMasterInfo());
		}
		updateUserPage(socket, id);
    });

}

exports.input = function (socket) {

	socket.on('userInput', function (d) {
		userData.updateInput(d);
		masterHandler.updateUserInfo();
	});

	socket.on('userReady', function (d) {
		userData.updateReady(d);
		masterHandler.updateUserInfo();
    });

}

function updateUserPage (socket, userId) {
	socket.emit('pageUpdate', quizData.getPageInfo(userId));
}
