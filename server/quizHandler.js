const fs = require('fs');
const csvsync = require('csvsync');
const userHandler = require('./userHandler');

let csvFile = fs.readFileSync('./quiz/quiz.csv');
let quizData = csvsync.parse(csvFile, {
    skipHeader: true,
    returnObject: true,
    headerKeys: ['type', 'category', 'question', 'true_answer', 'answer1', 'answer2', 'answer3', 'other'],
}); // true_answer = Server_side, Answer1-4 choices, Answer4 being generated when loading Question

let currentQuestion = 0;
let quizStatus = "question";
generateLastAnswer();

exports.getPageInfo = function (userId) {
    let data = {
        user: {
            name: userHandler.getUserById(userId).name,
            score: userHandler.getUserById(userId).score,
        },
        quiz: {
            status: quizStatus,
            question: "",
            type: "",
        }
    }
    if (quizStatus != "waiting" && quizStatus != "score" && quizStatus != "finished") {
        data.quiz.question = quizData[currentQuestion].question;
        data.quiz.type = quizData[currentQuestion].type;
        data.quiz.category = quizData[currentQuestion].category;
        if (quizData[currentQuestion].type == "choice") {
            data.quiz.answer1 = quizData[currentQuestion].answer1;
            data.quiz.answer2 = quizData[currentQuestion].answer2;
            data.quiz.answer3 = quizData[currentQuestion].answer3;
            data.quiz.answer4 = quizData[currentQuestion].answer4;
            if (quizStatus == "answer") data.quiz.trueAnswer = quizData[currentQuestion].true_answer;
        }
        if (quizData[currentQuestion].type == "guess") {
            data.quiz.answer1 = quizData[currentQuestion].answer1;
            if (quizStatus == "answer") data.quiz.trueAnswer = quizData[currentQuestion].true_answer;
        }
        if (quizData[currentQuestion].type == "free") {
            if (quizStatus == "answer") data.quiz.trueAnswer = quizData[currentQuestion].true_answer;
        }
        if (quizData[currentQuestion].type == "image") {
            data.quiz.image = quizData[currentQuestion].other;
            if (quizStatus == "answer") data.quiz.trueAnswer = quizData[currentQuestion].true_answer;
        }
        // TODO: Implement Sound & Video Types
    }
    // TODO: Implement Scoring
    return data;
}

exports.getQuiz = function () {
    return {
        status: quizStatus,
        question: quizData[currentQuestion].question,
        type: quizData[currentQuestion].type,
        category: quizData[currentQuestion].category,
        answer1: quizData[currentQuestion].answer1,
        answer2: quizData[currentQuestion].answer2,
        answer3: quizData[currentQuestion].answer3,
        answer4: quizData[currentQuestion].answer4,
        trueAnswer: quizData[currentQuestion].true_answer,
        other: quizData[currentQuestion].other,
        currentPage: (currentQuestion + 1) + '/' + quizData.length,
    };
}

function generateLastAnswer() {
    if (quizData[currentQuestion].type == "choice" && !quizData[currentQuestion].answer4) {
        let randNum = Math.floor((Math.random() * 4) + 1);
        if (randNum == 1) {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].answer1;
            quizData[currentQuestion].answer1 = quizData[currentQuestion].true_answer;
        } else if (randNum == 2) {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].answer2;
            quizData[currentQuestion].answer2 = quizData[currentQuestion].true_answer;
        } else if (randNum == 3) {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].answer3;
            quizData[currentQuestion].answer3 = quizData[currentQuestion].true_answer;
        } else {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].true_answer;
        }
        console.log('Randomly chose Answer no. 4');
    }
    console.log("quizData[currentQuestion].type "+quizData[currentQuestion].type);
    console.log("quizData[currentQuestion].answer4 "+quizData[currentQuestion].answer4);
    console.log('Answer no.4: ' + quizData[currentQuestion].answer4);
}

exports.changeQuestion = function (dirCount) {
    currentQuestion += dirCount;
    generateLastAnswer();
}