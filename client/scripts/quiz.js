// Imports
var socket = io();
var info = {};

socket.on('connect', function(){
    if (!sessionStorage.userId) window.location = "/";
    if (sessionStorage.userId) socket.emit('validateLogin', sessionStorage.userId);
});

socket.on('validateSuccess', function (isMaster) { 
    if (isMaster == true) { 
        window.location = "/master";
    }
});

socket.on('validationFailed', function () {
    sessionStorage.userId = null;
    window.location = "/";
});

socket.on('resetInput', function () {
    $('#user_answer').val("");
});

socket.on('notifyUpdate', function () {
    socket.emit('requestUpdate', sessionStorage.userId);
});

function refreshPage () { location.reload() } 

/*      ||              ||
        ||  Quiz-Logic  ||
        \/              \/     */

socket.on('pageUpdate', function(pageInfo) {
    // Set the template if needed.
    if (!info.quiz) {
        setTemplate(pageInfo.quiz);
    } else {
        if (pageInfo.quiz.type != info.quiz.type && pageInfo.status != "waiting" && pageInfo.status != "score" && pageInfo.status != "finished") {
            setTemplate(pageInfo.quiz);
        }
    }

    info = pageInfo;

    if (info.quiz.type == "choice") {
        $('#question').html(info.quiz.question);
        $('#answer1').html(info.quiz.answer1);
        $('#answer2').html(info.quiz.answer2);
        $('#answer3').html(info.quiz.answer3);
        $('#answer4').html(info.quiz.answer4);
    }

    if (info.quiz.type == "free") {
        $('#question').html(info.quiz.question);
    }

    if (info.quiz.type == "guess") {
        $('#question').html(info.quiz.question);
        var range = info.quiz.other.split("-");
        $('#user_answer').attr("min", range[0]);
        $('#user_answer').attr("max", range[1]);
        $('#user_answer_reflection').html($('#user_answer').val());
    }

    if (info.quiz.type == "image") {
        $('#image').attr("src", info.quiz.other);
        if (info.quiz.status == "answer") $('#trueAnswer').html(info.quiz.trueAnswer);
        $('.materialboxed').materialbox();
    }

    if (info.quiz.type == "yt") {
        $('#video').attr("src", info.quiz.other);
        if (info.quiz.status == "answer") $('#trueAnswer').html(info.quiz.trueAnswer);
    }

});

function setTemplate(quizInfo) {
    if (quizInfo.status == "waiting") $('#pageContent').html($('#waiting-template').html());
    if (quizInfo.status == "score") $('#pageContent').html($('#score-template').html());
    if (quizInfo.status == "finished") $('#pageContent').html($('#finished-template').html());
    
    if (quizInfo.type == "choice") $('#pageContent').html($('#choice-template').html());
    if (quizInfo.type == "guess") $('#pageContent').html($('#guess-template').html());
    if (quizInfo.type == "free") $('#pageContent').html($('#free-template').html());
    if (quizInfo.type == "image") $('#pageContent').html($('#image-template').html());
    if (quizInfo.type == "yt") $('#pageContent').html($('#yt-template').html());
}

function choiceSelect(nr) {
    if (!$('#answer'+nr).hasClass('active')) {
        $('.collection-item').removeClass('active');
        $('#answer'+nr).addClass('active');
    }
    // Update Logic for this type goes here:
    socket.emit('userInput', { input: nr, id: sessionStorage.userId });
}

function submitUpdate() {
    socket.emit('userInput', { input: $('#user_answer').val(), id: sessionStorage.userId });
}

function submitReady() {
    if ($('#ready').is(':checked')) {
        socket.emit('userReady', { id: sessionStorage.userId, ready: true });
    } else if ($('#ready')) {
        socket.emit('userReady', { id: sessionStorage.userId, ready: false });
    }
}
