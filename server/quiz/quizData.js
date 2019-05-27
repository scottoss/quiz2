// Import Libraries and Modules
const fileSystem = require('fs');
const csvParser = require('csvsync');
const userHandler = require('../users/userData');

// Import Quiz Data
let csvFile = fileSystem.readFileSync('data/quiz.csv');
let quizData = csvParser.parse(csvFile, {
    skipHeader: true,
    returnObject: true,
    headerKeys: ['type', 'category', 'question', 'true_answer', 'answer1', 'answer2', 'answer3', 'other'],
}); // answer4 is being generated later

// Init variables
let currentQuestion = 0;
let quizStatus = "question"; // "waiting", "score", "finished", "question", "answer"
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
        data.quiz.number = currentQuestion;
        if (quizStatus == "answer") data.quiz.trueAnswer = quizData[currentQuestion].true_answer;
        if (quizData[currentQuestion].type == "choice") {
            data.quiz.answer1 = quizData[currentQuestion].answer1;
            data.quiz.answer2 = quizData[currentQuestion].answer2;
            data.quiz.answer3 = quizData[currentQuestion].answer3;
            data.quiz.answer4 = quizData[currentQuestion].answer4;
        }
        if (quizData[currentQuestion].type == "guess") {
            data.quiz.other = quizData[currentQuestion].other;
        }
        if (quizData[currentQuestion].type == "image") {
            data.quiz.other = quizData[currentQuestion].other;
        }
        if (quizData[currentQuestion].type == "yt") {
            data.quiz.other = quizData[currentQuestion].other;
        }
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
            quizData[currentQuestion].true_answer = 1;
        } else if (randNum == 2) {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].answer2;
            quizData[currentQuestion].answer2 = quizData[currentQuestion].true_answer;
            quizData[currentQuestion].true_answer = 2;
        } else if (randNum == 3) {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].answer3;
            quizData[currentQuestion].answer3 = quizData[currentQuestion].true_answer;
            quizData[currentQuestion].true_answer = 3;
        } else {
            quizData[currentQuestion].answer4 = quizData[currentQuestion].true_answer;
            quizData[currentQuestion].true_answer = 4;
        }
    }
}

exports.changeQuestion = function (dirCount) {
    currentQuestion += dirCount;
    if (quizStatus == "answer") quizStatus = "question";
    generateLastAnswer();
}

exports.revealAnswer = function (isRevealed) {
    if (isRevealed == true) {
        quizStatus = "answer";
    } else {
        quizStatus = "question";
    }
}
