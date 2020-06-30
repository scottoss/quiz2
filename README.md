# Node-Quiz-Server

A simple NodeJS quiz server using ExpressJS and Socket.io

### Structure

- `client` (All files delivered to clients)
- `data` (Your custom quiz data, Questions and Users)
- `sass` (To-Compile Stylesheets)
- `server` (All the server logic)

### Installation

- download
- run `npm install`
- run `npm start`

### How to use

There are 5 different question-types:

- `choice` - Choose between 4 possible answers
- `guess` - Guess a number in a range
- `free` - Only text question
- `image` - Embedded Image w/ question
- `yt` - Embedded Youtube-Videos w/ question

**You need to provide 2 files.**

1. `data/quiz.csv` - Providing all the questions and answers. Like this:

   | Type | Category | Question | Right Answer | Answer 2 | Answer 3 | Answer 4 | Other |
   | ---- | -------- | -------- | ------------ | -------- | -------- | -------- | ----- |
   |      |          |          |              |          |          |          |       |

   The first row will be omitted, so you can have a header 1st row.

   The last column "Other" needs to contain a range for guess-questions (Like "10-20").
   For images and yt-typed questions you'll need to put a link in there. (For Youtube, remember to use an embedded link)

2. `data/users.json` - Providing all usernames and their password. They need to be predefined.

   ```json
   {
     "users": [
       { "name": "GameMaster", "password": "SomePassword" },
       { "name": "User1", "password": "User1pw" },
       { "name": "User2", "password": "User2pw" },
       { "name": "User3", "password": "User3pw" }
     ]
   }
   ```

   The first one will get to be the gamemaster.

There are four **Joker-Types**:

- `3x` - Will grant double points for current question
- `spy` - Will allow the user to see all other answers for this round!
- `hint` - Will randomly show a small selection of the answer (E.g. '1\_\_')

_All Jokers are temporarily removed from the game, as the architecture will be rebuilt._

### Features

- Live-Preview of selected answers
- GameMaster that controls the quiz (Like a moderator)
- Score Keeping
- Different Question types
- Imports a .csv file for questions & answers.
- Pre-select the usernames to avoid confusion during the game. (data/users.json)

### History

This type of quiz is originally from the german youtube channel "Pietsmiet" which is doing a quiz format. There, the participants record their webcams as well as a Google Document where they type in the answers.

This quiz is made to be moderated and maybe screen-recorded. The different question types were my idea to create a bit more variety.

### The Future

I'll be re-building this quiz server in Vue / Nuxt.js which will allow me to maintain everything more easily.
That will introduce new Joker types, as well as a nicer UI.
