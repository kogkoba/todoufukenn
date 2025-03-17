let time = 60;
let points = 0;
let timer;
let questions = [];

async function loadQuestions() {
    try {
        const res = await fetch('./data/questions.json'); // ✅ 正しいパス
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        questions = await res.json();
        console.log("問題データをロードしました:", questions);
    } catch (error) {
        console.error("問題データの読み込みに失敗しました:", error);
    }
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
    const questionElement = document.getElementById('question');
    questionElement.innerText = questionData.question;
    questionElement.style.animation = 'none';
    let scrollCount = 0;
setTimeout(() => {
    if (scrollCount < 2) {
        questionElement.style.animation = 'scrollText 10s linear 3';
    } else {
        questionElement.style.animation = 'none';
        questionElement.style.position = 'absolute';
        questionElement.style.top = '50%';
        questionElement.style.left = '50%';
        questionElement.style.transform = 'translate(-50%, -50%)';
        questionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        questionElement.style.padding = '10px';
        questionElement.style.borderRadius = '10px';
    }
    scrollCount++;
}, 500);
    setTimeout(() => {
        questionElement.style.animation = 'scrollText 10s linear 3';
    }, 500);
    setTimeout(() => {
        questionElement.style.animation = 'scrollText 10s linear 3'; // ✅ 速度を遅くする
    }, 100);
    
    let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    choices.push(questionData);
    choices = choices.sort(() => Math.random() - 0.5);

    let cardsHTML = '<div class="grid-container">';
    choices.forEach((pref) => {
        cardsHTML += `<div class="grid-item"><img src="./images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')"></div>`;
    });
    cardsHTML += '</div>';
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
