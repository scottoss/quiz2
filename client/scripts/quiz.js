// Imports
var socket = io();
var quiz = {};
var user = {};

socket.on('connect', function(){
    if (!sessionStorage.sessionToken) window.location = "/";
    if (sessionStorage.sessionToken) socket.emit('validateToken', sessionStorage.sessionToken);
});

socket.on('validationSuccess', function (isMaster) { 
    if (isMaster == true) { 
        window.location = "/master";
    }
    socket.emit('requestUpdate', sessionStorage.sessionToken);
});

socket.on('validationFailed', function () {
    sessionStorage.sessionToken = null;
    window.location = "/";
});

socket.on('resetInput', function () {
    $('#user-answer').val("");
});

socket.on('notifyUpdate', function () {
    socket.emit('requestUpdate', sessionStorage.sessionToken);
});

function refreshPage () { location.reload() } 

/*      ||              ||
        ||  Quiz-Logic  ||
        \/              \/     */

socket.on('pageUpdate', function(data) {
    // Set the template if needed.
    if (quiz != {}) {
        quiz = data.quiz;
        user = data.user;
        setTemplate();
    } else {
        if (data.quiz.number != quiz.number && data.status != "waiting" && data.status != "score" && data.status != "finished") {
            quiz = data.quiz;
            user = data.user;
            setTemplate();
        } else if (data.quiz.status == "answer" && quiz.status == "question" || data.quiz.status == "question" && quiz.status == "answer") {
            // On answer-reveal, don't apply template.
            quiz = data.quiz;
            user = data.user;
        } else {
            quiz = data.quiz;
            user = data.user;
            setTemplate();
        }
    }

    if (quiz.type == "choice") {
        $('#question').html(quiz.question);
        $('#answer1').html(quiz.answer1);
        $('#answer2').html(quiz.answer2);
        $('#answer3').html(quiz.answer3);
        $('#answer4').html(quiz.answer4);
    }

    if (quiz.type == "free") {
        $('#question').html(quiz.question);
    }

    if (quiz.type == "guess") {
        $('#question').html(quiz.question);
        var range = quiz.other.split("-");
        $('#guess-answer').attr("min", range[0]);
        $('#guess-answer').attr("max", range[1]);
        $('#guess-answer-reflection').html($('#guess-answer').val());
    }

    if (quiz.type == "image") {
        $('#image').attr("src", quiz.other);
        $('.materialboxed').materialbox();
    }

    if (quiz.type == "yt") {
        $('#video').attr("src", quiz.other);
    }

    if (quiz.status != "score") $('#score').html(user.score);

    if (quiz.status == "question") {
        $('#trueAnswer').parent().attr("hidden", "hidden");
    }

    if (quiz.status == "answer") {
        $('#trueAnswer').parent().removeAttr("hidden");
        if (quiz.type == "choice") {
            $('#trueAnswer').html($('#answer'+quiz.trueAnswer).html());
        } else {
            $('#trueAnswer').html(quiz.trueAnswer);
        }
    }

});

function setTemplate() {
    if (quiz.status == "waiting") $('#page-content').html($('#waiting-template').html());
    if (quiz.status == "score") $('#page-content').html($('#score-template').html());
    if (quiz.status == "finished") $('#page-content').html($('#finished-template').html());
    
    if (quiz.status == "question" || quiz.status == "answer") {
        $('#page-content').html($('#quiz-template').html());

        if (quiz.type == "image") $('#image-type').removeAttr("hidden");
        if (quiz.type == "yt") $('#yt-type').removeAttr("hidden");
        if (quiz.type == "choice") $('#choice-type').removeAttr("hidden");
        if (quiz.type == "guess") $('#guess-type').removeAttr("hidden");
        if (quiz.type != "choice" && quiz.type != "guess") $('#user-answer').parent().removeAttr("hidden");
    }
}

function choiceSelect(nr) {
    if (!$('#answer'+nr).hasClass('active')) {
        $('.collection-item').removeClass('active');
        $('#answer'+nr).addClass('active');
    }
    // Update Logic for this type goes here:
    socket.emit('userInput', { input: nr, token: sessionStorage.sessionToken });
}

function submitUpdate() {
    if (quiz.type == "guess") {
        socket.emit('userInput', { input: $('#guess-answer').val(), token: sessionStorage.sessionToken });
    } else {
        socket.emit('userInput', { input: $('#user-answer').val(), token: sessionStorage.sessionToken });
    }
}

function submitReady() {
    if ($('#ready').is(':checked')) {
        socket.emit('userReady', { token: sessionStorage.sessionToken, ready: true });
    } else if ($('#ready')) {
        socket.emit('userReady', { token: sessionStorage.sessionToken, ready: false });
    }
}

function updateReflection() {
    $('#guess-answer-reflection').html($('#guess-answer').val());
}
