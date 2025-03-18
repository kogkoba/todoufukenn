let time = 60;
let points = 0;
let timer;
let questions = [];
let scrollCount = 0; // 問題の流れる回数をカウント

// JSONデータを読み込む
async function loadQuestions() {
    try {
        const res = await fetch('./data/questions.json'); // ✅ パス修正
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        questions = await res.json();
        console.log("問題データをロードしました:", questions);
    } catch (error) {
        console.error("問題データの読み込みに失敗しました:", error);
    }
}

// ゲーム開始
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

// 問題の表示処理
function nextQuestion() {
    if (time <= 0) return;

    scrollCount = 0; // カウントリセット
    const questionData = questions[Math.floor(Math.random() * questions.length)];
    const questionElement = document.getElementById('question');

    questionElement.innerText = questionData.question;
    questionElement.style.animation = 'none';
    questionElement.style.left = '100vw';  // 画面外からスタート
    questionElement.style.display = 'block';

    setTimeout(() => {
        scrollTextAnimation(questionElement, questionData);
    }, 100);
}

// 文字の流れるアニメーション
function scrollTextAnimation(element, questionData) {
    scrollCount++;

    if (scrollCount < 3) {
        element.style.animation = 'scrollText 10s linear';
        element.addEventListener('animationend', () => {
            scrollTextAnimation(element, questionData);
        }, { once: true });
    } else {
        element.style.animation = 'none';
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
        element.style.backgroundColor = 'rgba(255,255,255,0.9)';
        element.style.padding = '5px 10px';
        element.style.borderRadius = '5px';
        showCards(true, questionData);
    }
}

// 都道府県カードの表示
function showCards(showLabels, questionData) {
    let choicesSet = new Set();
    choicesSet.add(questionData.answer);

    while (choicesSet.size < 6) {
        let randomChoice = questions[Math.floor(Math.random() * questions.length)].answer;
        choicesSet.add(randomChoice);
    }

    let choices = Array.from(choicesSet).map(answer => {
        return questions.find(q => q.answer === answer);
    });

    let cardsHTML = '<div class="grid-container">';
    choices.forEach((pref) => {
        cardsHTML += `<div class="grid-item">
                        ${showLabels ? `<div class="pref-label">${pref.name}</div>` : ''}
                        <img src="./images/${pref.answer}" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')">
                      </div>`;
    });
    cardsHTML += '</div>';
    document.getElementById('cards').innerHTML = cardsHTML;
}

// 回答チェック
function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
        document.getElementById('points').innerText = points;
        document.getElementById('question').style.animation = 'none';
        setTimeout(nextQuestion, 500);
    }
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
