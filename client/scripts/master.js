// Imports
var socket = io();
var users = [];
var quiz = {};

$(document).ready(function(){
    $('#finish-modal').modal();
});

socket.on('connect', function(){
    if (!sessionStorage.sessionToken) window.location = "/";
    if (sessionStorage.sessionToken) socket.emit('validateToken', sessionStorage.sessionToken);
});

socket.on('validationSuccess', function (isMaster) { 
    if (isMaster != true) { 
        window.location = "/quiz";
    }
    socket.emit('requestUpdate', sessionStorage.sessionToken);
});

socket.on('validationFailed', function () {
    console.log("Validation failed.");
    window.location = "/";
});

socket.on('notifyUpdate', function () {
    socket.emit('requestUpdate', sessionStorage.sessionToken);
});
socket.on('notifyMasterUpdate', function () {
    socket.emit('requestUserUpdate', sessionStorage.sessionToken);
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
    if (quiz.status == "waiting") {
        $('#pageContent').html($('#waiting-template').html());
        $('#scoreStatusButton').prop('hidden', true);
        $('#bottom-panel').prop('hidden', true);
    }
    if (quiz.status == "score") {
        $('#pageContent').html($('#score-template').html());
        $('#scoreStatusButton').prop('hidden', true);
        $('#bottom-panel').prop('hidden', true);
    }
    if (quiz.status == "finished") {
        $('#pageContent').html($('#finished-template').html());
        $('#scoreStatusButton').prop('hidden', true);
        $('#bottom-panel').prop('hidden', true);
    }
    if (quiz.status == "question" || quiz.status == "answer") {
        $('#scoreStatusButton').prop('hidden', false);
        $('#bottom-panel').prop('hidden', false);

        $('#pageContent').html($('#ingame-template').html());

        if (quiz.type == "choice") $('#choice-type').removeAttr("hidden");
        if (quiz.type == "image") $('#image-type').removeAttr("hidden");
        if (quiz.type == "yt") $('#yt-type').removeAttr("hidden");
        if (quiz.type == "guess") $('#guess-type').removeAttr("hidden");

        if (quiz.status == "answer") {
            $('#answerSwitch').prop('checked', true);
            if (quiz.type == "choice") {
                $('#answer'+quiz.trueAnswer).addClass("active");
            } else {
                $('#answer-stage').removeAttr("hidden");
                $('#trueAnswer').parent().removeAttr("hidden");
                $('#trueAnswer').html(quiz.trueAnswer);
            }
        } else {
            $('#answerSwitch').prop('checked', false);
        }
    }
}

function updateScoreboard () {
    if (quiz.status == "question" || quiz.status == "answer") {
        let html = "";
        users.forEach(u => {
            let uHtml = $('#scoreboardUser').html();
            uHtml = uHtml.replace("USER", u.name + ": " + u.score);
            if (u.token) {
                uHtml = uHtml.replace('add_func=""', 'href=javascript:addScore("'+u.token+'")');
                uHtml = uHtml.replace('low_func=""', 'href=javascript:lowerScore("'+u.token+'")');
            } else {
                uHtml = uHtml.replace("collection-item", "collection-item red-text");
            }
            html += uHtml;
        });
        $('#scoreboard').html(html);
    }
    if (quiz.status == "score" || quiz.status == "finished") {
        let html = "";
        users.sort(function(a,b){
            return b.score-a.score;
        });
        users.forEach(u => {
            let userHtml = $('#scoreUser-template').html();
            userHtml = userHtml.replace("USER", u.name + ": " + u.score);
            html += userHtml;
        });
        $('#pageContent .collection').html(html);
    }
}

function updateAnswers () {
    let html = "";
    users.forEach(u => {
        let uHtml = $('#answerUser').html();
        uHtml = uHtml.replace("USER", u.name);
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

function nextQuestion() {
    let pageInfo = quiz.currentPage.split("/");
    console.log(pageInfo);
    if (pageInfo[0] == pageInfo[1]) {
        $('#finish-modal').modal("open");
    } else {
        socket.emit('nextQuestion');
    }
}
function lastQuestion() { socket.emit('lastQuestion'); }

function addScore(userToken) { socket.emit('addScore', userToken) }
function lowerScore(userToken) { socket.emit('lowerScore', userToken) }

function toggleAnswer() {
    let isActive = false;
    if ($('#answerSwitch').is(':checked')) {
        isActive = true;
    }
    socket.emit('showAnswers', isActive);
}

function changeStatus(newStatus) {
    if (newStatus == "score") {
        socket.emit('changeStatus', newStatus);
        $('#scoreStatusButton').prop('hidden', true);
    }
    if (newStatus == "question" || newStatus == "next") {
        socket.emit('changeStatus', newStatus);
        $('#scoreStatusButton').prop('hidden', false);
    }
}
