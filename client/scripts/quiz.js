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
    $('#user-answer').val("");
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
        info = pageInfo;
        setTemplate();
    } else {
        if (pageInfo.quiz.number != info.quiz.number && pageInfo.status != "waiting" && pageInfo.status != "score" && pageInfo.status != "finished") {
            info = pageInfo;
            setTemplate();
        } else if (pageInfo.quiz.status == "answer" && info.quiz.status == "question" || pageInfo.quiz.status == "question" && info.quiz.status == "answer") {
            // If only status was changed, don't apply template. (On answer-reveal)
        } else {
            info = pageInfo;
            setTemplate();
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
        $('#guess-answer').attr("min", range[0]);
        $('#guess-answer').attr("max", range[1]);
        $('#guess-answer-reflection').html($('#guess-answer').val());
    }

    if (info.quiz.type == "image") {
        $('#image').attr("src", info.quiz.other);
        $('.materialboxed').materialbox();
    }

    if (info.quiz.type == "yt") {
        $('#video').attr("src", info.quiz.other);
    }

    if (info.quiz.status != "score") $('#score').html(info.user.score);

    if (info.quiz.status == "question") {
        $('#trueAnswer').parent().attr("hidden", "hidden");
    }

    if (info.quiz.status == "answer") {
        $('#trueAnswer').parent().removeAttr("hidden");
        if (info.quiz.type == "choice") {
            $('#trueAnswer').html($('#answer'+info.quiz.trueAnswer).html());
        } else {
            $('#trueAnswer').html(info.quiz.trueAnswer);
        }
    }

});

function setTemplate() {
    if (info.quiz.status == "waiting") $('#pageContent').html($('#waiting-template').html());
    if (info.quiz.status == "score") $('#pageContent').html($('#score-template').html());
    if (info.quiz.status == "finished") $('#pageContent').html($('#finished-template').html());
    
    if (info.quiz.status == "question" || info.quiz.status == "answer") {
        $('#pageContent').html($('#page-content-template').html());

        if (info.quiz.type == "image") $('#image-type').removeAttr("hidden");
        if (info.quiz.type == "yt") $('#yt-type').removeAttr("hidden");
        if (info.quiz.type == "choice") $('#choice-type').removeAttr("hidden");
        if (info.quiz.type == "guess") $('#guess-type').removeAttr("hidden");
        if (info.quiz.type != "choice" && info.quiz.type != "guess") $('#user-answer').parent().removeAttr("hidden");
    }
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
    if (info.quiz.type == "guess") {
        socket.emit('userInput', { input: $('#guess-answer').val(), id: sessionStorage.userId });
    } else {
        socket.emit('userInput', { input: $('#user-answer').val(), id: sessionStorage.userId });
    }
}

function submitReady() {
    if ($('#ready').is(':checked')) {
        socket.emit('userReady', { id: sessionStorage.userId, ready: true });
    } else if ($('#ready')) {
        socket.emit('userReady', { id: sessionStorage.userId, ready: false });
    }
}

function updateReflection() {
    $('#guess-answer-reflection').html($('#guess-answer').val());
}
