// Imports
var socket = io();
var info = {};

socket.on('connect', function(){
    if (!sessionStorage.userId) window.location = "/";
    socket.emit('validateLogin', sessionStorage.userId);
});

socket.on('validationFailed', function () { window.location = "/" });

function refreshPage () { location.reload() } 

/*      ||              ||
        ||  Quiz-Logic  ||
        \/              \/     */

socket.on('pageUpdate', function(pageInfo) {
    // TODO: Remove Debug Info
    console.log(pageInfo);
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

});

function setTemplate(quizInfo) {
    if (quizInfo.status == "waiting") $('#pageContent').html($('#waiting-template').html());
    if (quizInfo.status == "score") $('#pageContent').html($('#score-template').html());
    if (quizInfo.status == "finished") $('#pageContent').html($('#finished-template').html());
    
    if (quizInfo.type == "choice") $('#pageContent').html($('#choice-template').html());
    if (quizInfo.type == "guess") $('#pageContent').html($('#guess-template').html());
    if (quizInfo.type == "free") $('#pageContent').html($('#free-template').html());
    if (quizInfo.type == "image") $('#pageContent').html($('#image-template').html());
}

function choiceSelect(nr) {
    if (!$('#answer'+nr).hasClass('active')) {
        $('.collection-item').removeClass('active');
        $('#answer'+nr).addClass('active');
    }
}