let next = document.querySelector('.next');
let previous = document.querySelector('.previous')

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let list = document.querySelector('.list')
let results = document.querySelector('.results')
let userScorePoint = document.querySelector('.userScorePoint')
let average = document.querySelector('.average')

let index = 0;
let points = 0;
let games = 0;
let averagee = 0;
let preQuestions;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index)
    });

function enableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function clearClass() {
    for (let i = 0; i < answers.length; i++) {
        let elem = answers[i]

        if (elem.classList.contains('correct')) {
            elem.classList.remove('correct')
        } else if (elem.classList.contains('incorrect')) {
            elem.classList.remove('incorrect')
        }
    }
}

function setQuestion(index) {
    clearClass();
    enableAnswers()

    question.innerHTML = preQuestions[index].question;

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none'
        answers[3].style.display = 'none'
    } else {
        answers[2].style.display = 'block'
        answers[3].style.display = 'block'
    }
    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];
}

next.addEventListener('click', function () {
    console.log("OK")
    index++;
    if (index >= preQuestions.length){
        let oldData = localStorage.getItem("key")
        if (oldData === null){
            games = 1
            averagee = points
            localStorage.setItem("key", JSON.stringify({
                wynik: points,
                sredni: points,
                ilosc: games
            }))
        }else{
            let obj = JSON.parse(localStorage.getItem("key"))
            games = obj.ilosc
            games++
            averagee = (obj.wynik + points)/games
            localStorage.setItem("key", JSON.stringify({
                wynik: points,
                sredni: averagee,
                ilosc: games
            }))
        }
        list.style.display = 'none'
        results.style.display = 'block'
        userScorePoint.innerHTML = points
        average.innerHTML = averagee

    }else {
        setQuestion(index)
        enableAnswers()
    }
})

previous.addEventListener('click', function () {
    index--;
    if (index < 0) {
        index = 0;
        return
    }
    setQuestion(index)
})

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(event) {
    event.classList.add('correct')
}

function markInCorrect(event) {
    event.classList.add('incorrect')
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    enableAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

