let time = 60;
let points = 0;
let timer;
let questions = [];

async function loadQuestions() {
    const res = await fetch('questions.json');
    questions = await res.json();
}

function startGame() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    
    timer = setInterval(() => {
        time--;
        document.getElementById('timer').innerText = time;
        if (time <= 0) {
            clearInterval(timer);
            alert(`ゲーム終了！ 獲得ポイント: ${points}点`);
        }
    }, 1000);
    
    nextQuestion();
}

function nextQuestion() {
    if (time <= 0) return;
    
    const questionData = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById('question').innerText = questionData.question;
    
    let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    choices.push(questionData);
    choices = choices.sort(() => Math.random() - 0.5);

    let cardsHTML = '';
    choices.forEach(pref => {
        cardsHTML += `<img src="assets/images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')">`;
    });
    document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
    } else {
        alert(`不正解！正解は${answer}です。`);
    }
    document.getElementById('points').innerText = points;
    nextQuestion();
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
