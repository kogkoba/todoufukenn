let time = 60;  // ← これを残す
let points = 0;
let timer;
let questions = [];


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
    questionElement.style.animation = 'none';
    questionElement.style.position = '';
    questionElement.style.top = '';
    questionElement.style.left = '';
    questionElement.style.transform = '';
    questionElement.style.backgroundColor = '';
    questionElement.style.padding = '';
    questionElement.style.borderRadius = '';

    let animationCount = 0;

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

    function showCards(showLabels = false) {
        let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
        choices.push(questionData);
        choices = choices.sort(() => Math.random() - 0.5);

        let cardsHTML = '<div class="grid-container">';
        choices.forEach((pref) => {
            cardsHTML += `<div class="grid-item">
                            ${showCards && scrollCount >= 3 ? `<div class="label">${pref.name}</div>` : ''}
                            <img src="./images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')">
                          </div>`;
        });
        cardsHTML += '</div>';
        document.getElementById('cards').innerHTML = cardsHTML;
    }

    animateQuestion();
}

function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
    } else {
        alert(`不正解！正解は${answer}です。`);
    }
    document.getElementById('points').innerText = points;
    nextQu
    } 
