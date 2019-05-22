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
socket.on('notifyMasterUpdate', function () {
    socket.emit('requestUserUpdate', sessionStorage.userId);
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
    updateAnswers();
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
        if (quiz.type == "guess") $('#guessRange').html(quiz.other);
        if (quiz.type == "free" && quiz.status == "answer") $('#trueAnswer').html(quiz.trueAnswer);
        if (quiz.type == "image") $('#image').attr("src", quiz.other);
        if (quiz.type == "image" && quiz.status == "answer") $('#trueAnswer').html(quiz.trueAnswer);
        if (quiz.type == "image") $('.materialboxed').materialbox();
        if (quiz.type == "yt") $('#video').attr("src", quiz.other);
        if (quiz.type == "yt" && quiz.status == "answer") $('#trueAnswer').html(quiz.trueAnswer);
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
        if (quiz.type == "yt") $('#quizSpace').html($('#yt-template').html());
    }
}

function updateScoreboard () {
    let html = "";
    users.forEach(u => {
        let uHtml = $('#scoreboardUser').html();
        uHtml = uHtml.replace("USER", u.name + ": " + u.score);
        if (u.id) {
            uHtml = uHtml.replace('add_func=""', 'href=javascript:addScore("'+u.id+'")');
            uHtml = uHtml.replace('low_func=""', 'href=javascript:lowerScore("'+u.id+'")');
        } else {
            uHtml = uHtml.replace("collection-item", "collection-item red-text");
        }
        html += uHtml;
    });
    $('#scoreboard').html(html);
}

function updateAnswers () {
    let html = "";
    users.forEach(u => {
        let uHtml = $('#answerUser').html();
        uHtml = uHtml.replace("USER", u.name + " &gt;");
        if (u.input) {
            if (quiz.type != "choice") {
                uHtml = uHtml.replace('ANSWER', u.input);
            }  else {
                uHtml = uHtml.replace('ANSWER', quiz["answer"+u.input]);
            }
        } else {
            uHtml = uHtml.replace('ANSWER', '~');
        }
        if (u.ready == true) {
            uHtml = uHtml.replace('</li>','<i class="material-icons">check_box</i></li>');
        } else {
            uHtml = uHtml.replace('</li>','<i class="material-icons">check_box_outline_blank</i></li>');
        }
        html += uHtml;
    });
    $('#answers').html(html);
}

// Manual Stuff (Controls):

function nextQuestion() { socket.emit('nextQuestion'); }
function lastQuestion() { socket.emit('lastQuestion'); }

function addScore(id) { socket.emit('addScore', id) }
function lowerScore(id) { socket.emit('lowerScore', id) }
