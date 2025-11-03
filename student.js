let units = JSON.parse(localStorage.getItem("units") || "{}");
let currentUnit = {};
let questions = [];
let currentIndex = 0;
let wrongAnswers = [];

const unitSelect = document.getElementById("unitSelect");
const startBtn = document.getElementById("startBtn");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const resultEl = document.getElementById("result");
const progressEl = document.getElementById("progress");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const finishBtn = document.getElementById("finishBtn");
const testSection = document.getElementById("testSection");
const retrySection = document.getElementById("retrySection");

// 単元の読み込み
function loadUnits() {
  Object.keys(units).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    unitSelect.appendChild(opt);
  });
}

loadUnits();

// テスト開始
startBtn.onclick = () => {
  const name = unitSelect.value;
  if (!name) return alert("単元を選んでください。");
  currentUnit = units[name];
  questions = Object.entries(currentUnit);
  currentIndex = 0;
  wrongAnswers = [];

  document.getElementById("unitSelectSection").style.display = "none";
  testSection.style.display = "block";
  showQuestion();
};

// 問題表示
function showQuestion() {
  if (currentIndex >= questions.length) {
    endTest();
    return;
  }
  const [jp, en] = questions[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}. 「${jp}」の英語は？`;
  progressEl.textContent = `${currentIndex + 1} / ${questions.length}`;
  answerEl.value = "";
  resultEl.textContent = "";
  nextBtn.style.display = "none";
  finishBtn.style.display = "none";
  answerEl.focus();
}

// 回答チェック
function checkAnswer() {
  const userAns = answerEl.value.trim().toLowerCase();
  const [jp, en] = questions[currentIndex];
  if (!userAns) return;

  if (userAns === en.toLowerCase()) {
    resultEl.textContent = "⭕ 正解！";
    resultEl.style.color = "green";
  } else {
    resultEl.textContent = `❌ 不正解。正解は「${en}」`;
    resultEl.style.color = "red";
    wrongAnswers.push([jp, en]);
  }

  nextBtn.style.display = "inline-block";
  submitBtn.style.display = "none";
}

// 次の問題へ
function nextQuestion() {
  currentIndex++;
  submitBtn.style.display = "inline-block";
  nextBtn.style.display = "none";
  showQuestion();
}

// テスト終了
function endTest() {
  testSection.style.display = "none";
  retrySection.style.display = "block";
  if (wrongAnswers.length === 0) {
    retrySection.innerHTML = "<h2>全問正解！すばらしい！🎉</h2>";
  }
}

// 間違いを再挑戦
document.getElementById("retryBtn").onclick = () => {
  if (wrongAnswers.length === 0) return alert("間違えた問題はありません！");
  questions = wrongAnswers;
  currentIndex = 0;
  wrongAnswers = [];
  retrySection.style.display = "none";
  testSection.style.display = "block";
  showQuestion();
};

// Enterキー操作
answerEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (submitBtn.style.display !== "none") {
      checkAnswer();
    } else {
      nextQuestion();
    }
  }
});

// ボタンイベント
submitBtn.onclick = checkAnswer;
nextBtn.onclick = nextQuestion;
finishBtn.onclick = endTest;

// 戻るボタン
document.getElementById("backBtn").onclick = () => {
  window.location.href = "index.html";
};