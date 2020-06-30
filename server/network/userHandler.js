const masterHandler = require("./masterHandler");
const userData = require("../users/userData");
const quizData = require("../quiz/quizData");

exports.pageUpdates = function(socket) {
  socket.on("requestUpdate", function(token) {
    if (userData.checkMaster(token) == true) {
      socket.emit("masterQuiz", quizData.getQuiz());
      socket.emit("masterUsers", userData.getMasterInfo());
    }
    updateUserPage(socket, token);
  });
};

exports.input = function(socket) {
  socket.on("userInput", function(d) {
    userData.updateInput(d);
    masterHandler.updateUserInfo();
  });

  socket.on("userReady", function(d) {
    userData.updateReady(d);
    masterHandler.updateUserInfo();
  });
};

function updateUserPage(socket, token) {
  socket.emit("pageUpdate", quizData.getPageInfo(token));
}
