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

// ✅ CSS でグリッド配置と問題文のスタイルを調整
document.head.insertAdjacentHTML("beforeend", `
<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 10px; /* ✅ 画像間の隙間を適切に設定 */
        justify-content: center;
        align-items: center;
        margin-top: 50px; /* ✅ 画像の位置を下げてテキストと重ならないように */
    }
    .grid-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .grid-item img {
        width: 100%;
        max-width: 140px;
        height: auto;
    }
    #question {
        font-size: 2.5rem; /* ✅ さらに見やすく大きく */
        font-weight: bold;
        text-align: center;
        margin-bottom: 50px; /* ✅ 画像と適切な距離を確保 */
    }
</style>
`);
