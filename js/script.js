fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        next.addEventListener('click', function () {
            if (index >= preQuestions.length-1) {
                clearInterval(interval);
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
                saveToLocalStorage();
            }
            else{
                index++;
                clearInterval(interval);
                setQuestion(index);
            }
            activateAnswers();
        });
        previous.addEventListener('click', function () {
            if(index>0) {
                index--;
                clearInterval(interval);
                setQuestion(index);


            }
        });
    });
let preQuestions;
let interval;
let next = document.querySelector('.next');
let previous=document.querySelector('.previous');

let questionNumber=document.querySelector('#questionNumber');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let list = document.querySelector(".list");
let results = document.querySelector(".results");
let userScorePoint =document.querySelector(".userScorePoint");
let average = document.querySelector(".average");

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

let start =document.querySelector(".start");
let startButton=document.querySelector(".startButton");
let progressBar=document.querySelector(".progress-bar");
startButton.addEventListener('click',()=>{
    start.style.display='none';
    startQuiz();
})
for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}
function setQuestion(index) {
    //clearClass();
    startTimer();
    questionNumber.innerHTML=index+1;
    question.innerHTML = preQuestions[index].question;
    removeMarking();
    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}
function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}
activateAnswers();
function markCorrect(elem) {
    elem.classList.add('correct');
}
function markInCorrect(elem) {
    elem.classList.add('incorrect');
}
function removeMarking(){
    answers.forEach(el=>{
        el.classList.remove('correct');
        el.classList.remove('incorrect');
    })

}
function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}


function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}
function saveToLocalStorage(){
    let prev = JSON.parse(localStorage.getItem("quizHistory"));
    let obj;
    if(prev===null){
        average.innerHTML=points;
        obj={
            numberOfTries:1,
            averagePoints:points
        }
    }
    else{
        average.innerHTML=prev.averagePoints;
        obj = {
            numberOfTries:prev.numberOfTries+1,
            averagePoints:(prev.averagePoints*prev.numberOfTries+points)/(prev.numberOfTries+1)
        };
    }
    localStorage.setItem("quizHistory", JSON.stringify(obj));


}

function startQuiz(){
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
}
function startTimer(){
    let time=20;
    progressBar.style.width=`${time*5}%`
    interval= setInterval(timer, 1000);
    function timer() {
        time-=1;
        progressBar.style.width=`${time*5}%`
        console.log(time+" "+progressBar.style.width)
        if(time===0){
            clearInterval(interval);
            next.click();
        }
    }

}
restart.addEventListener('click', function (event) {
    event.preventDefault();

    startQuiz();
});
