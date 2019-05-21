// Imports
var socket = io();
var users = [];
var quiz = {};

socket.on('connect', function(){
    if (!sessionStorage.userId) window.location = "/";
    if (sessionStorage.userId) socket.emit('validateLogin', sessionStorage.userId);
});

socket.on('validateSuccess', function (isMaster) { 
    if (isMaster != true) { 
        window.location = "/quiz";
    }
    socket.emit('requestUpdate', sessionStorage.userId);
});

socket.on('validationFailed', function () { console.log("Validation failed."); window.location = "/" });

socket.on('notifyUpdate', function () {
    socket.emit('requestUpdate', sessionStorage.userId);
});

function refreshPage () { location.reload() } 

// Automatic Stuff:

socket.on('masterQuiz', function(data) {
    quiz = data;
    updateQuizInfo();
});

socket.on('masterUsers', function(data) {
    users = data;
    updateScoreboard();
});

function updateQuizInfo () {
    applyTemplate();
    if (quiz.status == "question" || quiz.status == "answer") {
        $('#question').html(quiz.question);
        $('#category').html(quiz.category);
        $('#pageNumber').html(quiz.currentPage);
        if (quiz.type == "choice") {
            $('#answer1').html(quiz.answer1);
            $('#answer2').html(quiz.answer2);
            $('#answer3').html(quiz.answer3);
            $('#answer4').html(quiz.answer4);
        }
    }
}

function applyTemplate() {
    if (quiz.status == "waiting") $('#pageContent').html($('#waiting-template').html());
    if (quiz.status == "score") $('#pageContent').html($('#score-template').html());
    if (quiz.status == "finished") $('#pageContent').html($('#finished-template').html());
    if (quiz.status == "question" || quiz.status == "answer") {
        $('#pageContent').html($('#ingame-template').html());
        if (quiz.type == "choice") $('#quizSpace').html($('#choice-template').html());
        if (quiz.type == "guess") $('#quizSpace').html($('#guess-template').html());
        if (quiz.type == "free") $('#quizSpace').html($('#free-template').html());
        if (quiz.type == "image") $('#quizSpace').html($('#image-template').html());
    }
}

function updateScoreboard () {

}

// Manual Stuff (Controls):

function nextQuestion() { socket.emit('nextQuestion'); }
function lastQuestion() { socket.emit('lastQuestion'); }
