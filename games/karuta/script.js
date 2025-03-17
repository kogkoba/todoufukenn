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
    
    // ✅ 変更1: 正解時に問題文をいったん消す
    questionElement.innerText = "";
    
    // ✅ 変更2: 右から左へ流れるアニメーションを追加
    setTimeout(() => {
        questionElement.innerText = questionData.question;
        questionElement.style.animation = 'none';
        questionElement.style.position = 'absolute';
        questionElement.style.right = '100%'; // 画面外に配置
        questionElement.style.left = 'auto';  
        questionElement.style.transform = 'translateX(0%)';

        setTimeout(() => {
            questionElement.style.animation = 'scrollText 10s linear';
        }, 100); // 少し遅れてアニメーション開始
    }, 500); // 問題文を一瞬消す時間
    
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

// ✅ 変更3: 選択肢6つが絶対に被らないように修正
function showCards(showLabels = false) {
    let choices = [];
    let availableQuestions = questions.filter(q => q.answer !== questions[currentQuestionIndex - 1].answer);
    
    // 正解を含めた6つの選択肢をランダムで取得（被らないようにする）
    while (choices.length < 5) {
        let randomIndex = Math.floor(Math.random() * availableQuestions.length);
        let randomChoice = availableQuestions.splice(randomIndex, 1)[0];
        choices.push(randomChoice);
    }
    
    choices.push(questions[currentQuestionIndex - 1]); // 正解を追加
    choices = choices.sort(() => Math.random() - 0.5); // 配置をランダム化

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

// ✅ 変更4: 正解が押されたら、次の問題を流す
function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
        document.getElementById('points').innerText = points;
        
        // ✅ 変更: 問題文を消して、すぐに次の問題を流す
        document.getElementById('question').innerText = "";

        setTimeout(() => {
            nextQuestion();
        }, 500); // 一瞬消した後、次の問題を流す
    } else {
        alert(`不正解！正解は${answer}です。`);
    }
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
