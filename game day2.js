const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQuestion = {};
let accepringAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
let explanation = [];

fetch("questions day2.json")
    .then(res =>{
    return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions
    startGame();
})
.catch( err => {
    console.error(err);
});


// CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    qustionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getExplanation =() =>{
    alert(JSON.stringify(questions[questionCounter-2].explanation));
    }


getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign("/end.html");
    }

    questionCounter++;
    progressText.innerText = `Qusetion ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    currentQuestion = availableQuestions[questionCounter-1];
    question.innerText = currentQuestion.question;

    choices.forEach( choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });


    accepringAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!accepringAnswers) return;

        accepringAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
         
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        
        if(classToApply === "correct"){
            IncrementScore(CORRECT_BONUS);
         } 

        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
            getExplanation();
        }, 1000);        
    });
});

IncrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
