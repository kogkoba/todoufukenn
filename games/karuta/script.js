let time = 60;
let points = 0;
let timer;
let questions = [];

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
