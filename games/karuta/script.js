let time = 60;
let points = 0;
let timer;
let questions = [];

async function loadPrefectureData() {
    try {
        const res = await fetch('./assets/map/prefectures.json');  // ✅ JSONデータを取得
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("都道府県データの読み込みに失敗しました:", error);
        return {};
    }
}

function highlightPrefecture(answer) {
    const mapContainer = document.getElementById('map-container');
    
    // 既存のマーカーを削除
    mapContainer.querySelectorAll('.prefecture-marker').forEach(marker => marker.remove());

    // 座標データを読み込み、正解の都道府県にマーカーを表示
    loadPrefectureData().then(prefData => {
        if (prefData[answer]) {
            const marker = document.createElement('div');
            marker.classList.add('prefecture-marker');
            marker.style.left = `${prefData[answer].x}%`;
            marker.style.top = `${prefData[answer].y}%`;
            mapContainer.appendChild(marker);
        }
    });
}

// 画像をクリックしたときの処理に `highlightPrefecture(answer)` を追加
function checkAnswer(element, selected, answer) {
    if (selected === answer) {
        element.classList.add("correct");
        points += 10;
    } else {
        element.classList.add("wrong");
    }
    document.getElementById('points').innerText = points;
    highlightPrefecture(answer);  // ✅ 日本地図にマーカーを表示
    setTimeout(nextQuestion, 2000);
}


async function loadQuestions() {
    try {
        const res = await fetch('./data/questions.json');
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
        questionElement.style.animation = 'scrollText 4s linear 3';
    }, 100);
    
    let choices = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    choices.push(questionData);
    choices = choices.sort(() => Math.random() - 0.5);

    let cardsHTML = '';
    choices.forEach(pref => {
        cardsHTML += `<img src="./images/${pref.answer}" onclick="checkAnswer(this, '${pref.answer}', '${questionData.answer}')">`;
    });
    document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(element, selected, answer) {
    if (selected === answer) {
        element.classList.add("correct");
        points += 10;
    } else {
        element.classList.add("wrong");
    }
    document.getElementById('points').innerText = points;
    setTimeout(nextQuestion, 2000);
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
