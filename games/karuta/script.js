```javascript
let time = 60;
let points = 0;
let timer;
let questions = [];

async function loadQuestions() {
    const res = await fetch('./data/questions.json');
    return await res.json();
}

function startGame() {
    // タイマーセット
    timer = setInterval(() => {
        time--;
        document.getElementById('time').innerText = `制限時間：${time}秒`;
        if (time <= 0) clearInterval(timer);
    }, 1000);
    
    nextQuestion();
}

async function nextQuestion() {
    const data = await fetch('./data/questions.json').then(res => res.json());
    const question = data[Math.floor(Math.random() * data.length)];

    document.getElementById('question').innerText = question.text;

    let cardsHTML = '';
    question.choices.forEach(pref => {
        cardsHTML += `<img src="images/${pref}.png" onclick="checkAnswer('${pref}', '${question.answer}')">`;
    });
    document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(selected, answer) {
    if (selected === answer) {
        points += 10;
    } else {
        alert(`不正解！正解は${answer}です。`);
    }
    document.getElementById('points').innerText = `獲得ポイント：${points}点`;
    nextQuestion();
}

function nextQuestion() {
    // 次の問題の読み込みロジック
}

window.onload = startGame;
```
