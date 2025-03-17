let time = 60;
let points = 0;
let timer;
let questions = [];
let animationCount = 0;
let currentQuestionIndex = 0;

async function loadQuestions() {
    try {
        const res = await fetch('https://kogkoba.github.io/todoufukenn/games/karuta/data/questions.json');
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
    currentQuestionIndex = 0;
    timer = setInterval(() => {
        time--;
        document.getElementById('timer').innerText = time;
        if (time <= 0) {
            clearInterval(timer);
            alert(`ゲーム終了！獲得ポイント: ${points}点`);
        }
    }, 1000);

    nextQuestion();
}

function nextQuestion() {
    if (time <= 0) return;
    
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0; // 質問リストが終わったらリセット
    }

    const questionData = questions[currentQuestionIndex];
    currentQuestionIndex++; // 次の問題へ

    const questionElement = document.getElementById('question');
    questionElement.innerText = questionData.question;
    questionElement.style.animation = 'none';
    questionElement.style.position = '';
    questionElement.style.top = '';
    questionElement.style.left = '';
    questionElement.style.transform = '';
    questionElement.style.backgroundColor = '';
    questionElement.style.padding = '';
    questionElement.style.borderRadius = '';

    animationCount = 0;

    function animateQuestion() {
        if (animationCount < 2) {
            questionElement.style.animation = 'scrollText 10s linear';
            animationCount++;
        } else {
            questionElement.style.animation = 'none';
            questionElement.style.position = 'absolute';
            questionElement.style.top = '10px';
            questionElement.style.left = '50%';
            questionElement.style.transform = 'translateX(-50%)';
            questionElement.style.backgroundColor = 'rgba(255,255,255,0.9)';
            questionElement.style.padding = '5px 10px';
            questionElement.style.borderRadius = '5px';
            showCards(true);
            return;
        }

        questionElement.style.animation = 'scrollText 10s linear';
        animationCount++;
        questionElement.addEventListener('animationend', animateQuestion, { once: true });
    }

    animateQuestion();
    showCards(false);
}

function showCards(showLabels = false) {
    let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    choices.push(questions[currentQuestionIndex - 1]);
    choices = choices.sort(() => Math.random() - 0.5);

    let cardsHTML = '<div class="grid-container">';
    choices.forEach((pref) => {
        cardsHTML += `<div class="grid-item">
                        ${showLabels ? `<div class="label">${pref.name}</div>` : ''}
                        <img src="./images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questions[currentQuestionIndex - 1].answer}')">
                      </div>`;
    });
    cardsHTML += '</div>';
    document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
        document.getElementById('points').innerText = points;
        nextQuestion(); // ✅ 正解なら次の問題へ即移動
    } else {
        alert(`不正解！正解は${answer}です。`);
    }
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
