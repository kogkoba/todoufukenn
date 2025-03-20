let time = 60;
let points = 0;
let timer;
let questions = [];
let scrollCount = 0; // 問題の流れる回数をカウント

// JSONデータの読み込み（questions.json は ./data/ フォルダ内にある）
async function loadQuestions() {
  try {
    const res = await fetch('./data/questions.json');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    questions = await res.json();
    console.log("✅ 問題データをロードしました:", questions);
  } catch (error) {
    console.error("❌ 問題データの読み込みに失敗しました:", error);
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

  scrollCount = 0; // カウントをリセット
  // ランダムに問題を選ぶ
  const questionData = questions[Math.floor(Math.random() * questions.length)];
  const questionElement = document.getElementById('question');

  // 問題文を設定
  questionElement.innerText = questionData.question;
  questionElement.style.animation = 'none';
  questionElement.style.left = '100vw'; // 画面の右端からスタート
  questionElement.style.display = 'block';

  // すぐにアニメーション開始
  setTimeout(() => {
    scrollTextAnimation(questionElement, questionData);
  }, 100);
}

function scrollTextAnimation(element, questionData) {
  scrollCount++;
  if (scrollCount < 3) {
    element.style.animation = 'scrollText 10s linear';
    element.addEventListener('animationend', () => {
      scrollTextAnimation(element, questionData);
    }, { once: true });
  } else {
    // 3回目の後は中央に固定して、背景を付けて表示
    element.style.animation = 'none';
    element.style.left = '50%';
    element.style.transform = 'translateX(-50%)';
    element.style.backgroundColor = 'rgba(255,255,255,0.9)';
    element.style.padding = '5px 10px';
    element.style.borderRadius = '5px';
    showCards(true, questionData);
  }
}

// 6つの選択肢が重複しないように選ぶ（正解を含む）
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

  choices.sort(() => Math.random() - 0.5);

  let cardsHTML = '<div class="grid-container">';
  choices.forEach((pref) => {
    // 画像のパスを index.html からの相対パスとして指定（images フォルダは同じディレクトリ内）
    let imgPath = `./images/${pref.answer}`;
    console.log("🖼 画像のパス:", imgPath);

    cardsHTML += `<div class="grid-item">
                    ${showLabels ? `<div class="pref-label">${pref.name}</div>` : ''}
                    <img src="${imgPath}" onerror="this.onerror=null; console.error('❌ 画像が見つかりません:', this.src);" onclick="checkAnswer('${pref.answer}', '${questionData.answer}')">
                  </div>`;
  });
  cardsHTML += '</div>';
  document.getElementById('cards').innerHTML = cardsHTML;
}

function checkAnswer(selected, answer) {
  if (selected === answer) {
    points += 10;
    document.getElementById('points').innerText = points;
    // 正解の場合は問題文を非表示にして次の問題へ
    document.getElementById('question').style.display = 'none';
    setTimeout(nextQuestion, 500);
  } else {
    alert(`不正解！正解は ${answer} です。`);
  }
}

document.getElementById("start-button").addEventListener("click", startGame);
window.onload = loadQuestions;
