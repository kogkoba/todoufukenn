let time = 60;
let points = 0;
let timer;
let questions = [];
let animationCount = 0;

async function loadQuestions() {
    try {
        const res = await fetch('./data/questions.json');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        questions = await res.json();
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
            alert(`ゲーム終了！獲得ポイント: ${points}点`);
        }
    }, 1000);

    nextQuestion();
}

function nextQuestion() {
    if (time <= 0) return;

    const questionData = questions[Math.floor(Math.random() * questions.length)];
    const questionElement = document.getElementById('question');
    questionElement.innerText = questionData.question;

    resetQuestionStyles(questionElement);

    animationCount = 0;
    animateQuestion(questionElement, questionData);

    showCards(questionData, false);
}

function resetQuestionStyles(questionElement) {
    questionElement.style.animation = 'none';
    questionElement.style.position = '';
    questionElement.style.backgroundColor = '';
    questionElement.style.padding = '';
    questionElement.style.borderRadius = '';
    questionElement.style.transform = '';
}

function animateQuestion(questionElement, questionData) {
    if (animationCount < 3) {
        questionElement.style.animation = 'scrollText 10s linear';
        questionElement.onanimationend = () => {
            animationCount++;
            if (animationCount < 3) {
                questionElement.style.animation = 'none';
                void questionElement.offsetWidth; // 再描画トリック
                animateQuestion(questionElement, questionData);
            } else {
                showCards(questionData, true); // 3回目後にラベル表示
            }
        };
    }
}

function showCards(questionData, showLabels) {
    let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    choices.push(questionData);
    choices = choices.sort(() => Math.random() - 0.5);

    let cardsHTML = '<div class="grid-container">';
    choices.forEach((pref) => {
        cardsHTML += `
            <div class="grid-item">
                ${showLabels ? `<div class="pref-label">${pref.name}</div>` : ''}
                <img src="./images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')">
            </div>`;
    });
    cardsHTML += '</div>';
    document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
        document.getElementById('points').innerText = points;
        nextQuestion(); // 正解なら次の問題へ
    } else {
        alert(`不正解！正解は${answer.replace('.png','')}です。`);
        // 不正解時は何もしない（問題が最後まで流れる）
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start-button").addEventListener("click", startGame);
    loadQuestions();
});
