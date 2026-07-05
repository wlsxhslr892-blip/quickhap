const params = new URLSearchParams(window.location.search);
const certificateId = params.get("id") || "wihummul-gineungsa";
const setId = params.get("set") || "set-01";
const mode = params.get("mode") || "study";

const quizList = document.querySelector("#quizList");
const progressText = document.querySelector("#progressText");
const resultPanel = document.querySelector("#resultPanel");
const resultText = document.querySelector("#resultText");
const retryButton = document.querySelector("#retryButton");
const quizEyebrow = document.querySelector("#quizEyebrow");
const quizTitle = document.querySelector("#quizTitle");
const quizSummary = document.querySelector("#quizSummary");
const navCertificateLink = document.querySelector("#navCertificateLink");
const submitPanel = document.querySelector("#submitPanel");
const submitExamButton = document.querySelector("#submitExamButton");
const answers = new Map();
const checkedAnswers = new Set();

let questions = [];
let activeCertificate = null;

function getWrongNotes() {
  try {
    return JSON.parse(localStorage.getItem("quickpassWrongNotes") || "[]");
  } catch {
    return [];
  }
}

function saveWrongNote(question, certificate) {
  const notes = getWrongNotes();
  const noteId = `${certificate.id}:${question.id}`;
  const exists = notes.some((item) => item.noteId === noteId);

  if (!exists) {
    notes.push({
      noteId,
      id: question.id,
      certificateId: certificate.id,
      certificateName: certificate.name,
      title: question.title,
      explanation: question.explanation,
      concept: question.concept
    });
    localStorage.setItem("quickpassWrongNotes", JSON.stringify(notes));
  }
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("quickpassFavorites") || "[]");
  } catch {
    return [];
  }
}

function toggleFavorite(question, certificate, button) {
  const noteId = `${certificate.id}:${question.id}`;
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.noteId === noteId);
  const nextFavorites = exists
    ? favorites.filter((item) => item.noteId !== noteId)
    : favorites.concat({
        noteId,
        id: question.id,
        certificateId: certificate.id,
        certificateName: certificate.name,
        title: question.title,
        explanation: question.explanation,
        concept: question.concept
      });

  localStorage.setItem("quickpassFavorites", JSON.stringify(nextFavorites));
  button.textContent = exists ? "체크" : "체크 해제";
}

function updateProgress() {
  progressText.textContent = `${answers.size} / ${questions.length}`;
}

function renderEmpty(message) {
  quizList.innerHTML = `
    <article class="question-card">
      <h2>${message}</h2>
      <p>자격증 목록에서 학습 가능한 항목을 선택해주세요.</p>
      <a class="button primary" href="./certifications.html">자격증 목록 보기</a>
    </article>
  `;
}

function renderQuiz(certificate) {
  quizList.innerHTML = "";
  submitPanel.hidden = mode !== "exam";

  questions.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    card.innerHTML = `
      <p class="eyebrow">${question.concept}</p>
      <h2>${index + 1}. ${question.title}</h2>
      <div class="choice-list"></div>
      <div class="question-actions">
        <button class="mini-button answer-button" type="button">정답</button>
        <button class="mini-button favorite-button" type="button">체크</button>
        <button class="mini-button explanation-button" type="button">해설</button>
      </div>
      <div class="explanation" hidden>${question.explanation}</div>
    `;

    const choiceList = card.querySelector(".choice-list");
    const explanation = card.querySelector(".explanation");
    const favoriteButton = card.querySelector(".favorite-button");
    const answerButton = card.querySelector(".answer-button");
    const explanationButton = card.querySelector(".explanation-button");
    favoriteButton.addEventListener("click", () => toggleFavorite(question, certificate, favoriteButton));
    explanationButton.addEventListener("click", () => {
      explanation.hidden = !explanation.hidden;
      explanationButton.textContent = explanation.hidden ? "해설" : "해설 닫기";
    });

    function revealAnswer() {
      if (!answers.has(question.id)) return;
      checkedAnswers.add(question.id);

      Array.from(choiceList.children).forEach((item, itemIndex) => {
        if (itemIndex === question.answer) item.classList.add("correct");
        if (itemIndex === answers.get(question.id) && itemIndex !== question.answer) item.classList.add("wrong");
      });

      if (answers.get(question.id) !== question.answer) {
        saveWrongNote(question, certificate);
      }

      answerButton.textContent = answers.get(question.id) === question.answer ? "정답" : "오답";
      updateProgress();
      if (mode === "study" && checkedAnswers.size === questions.length) showResult();
    }

    answerButton.addEventListener("click", revealAnswer);

    question.choices.forEach((choice, choiceIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.textContent = `${choiceIndex + 1}. ${choice}`;
      button.addEventListener("click", () => {
        answers.set(question.id, choiceIndex);
        Array.from(choiceList.children).forEach((item) => {
          item.classList.remove("selected");
          if (mode === "study") {
            item.classList.remove("correct", "wrong");
          }
        });
        button.classList.add("selected");
        if (mode === "study") {
          answerButton.textContent = "정답";
          checkedAnswers.delete(question.id);
        }
        updateProgress();
      });
      choiceList.appendChild(button);
    });

    if (mode === "exam") {
      answerButton.hidden = true;
      explanationButton.hidden = true;
    }

    quizList.appendChild(card);

    const ad = document.createElement("aside");
    ad.className = "ad-inline";
    ad.setAttribute("aria-label", "문제 사이 광고");
    ad.innerHTML = "<span>광고 영역</span>";
    quizList.appendChild(ad);
  });
}

function showResult() {
  let correctCount = 0;
  questions.forEach((question) => {
    if (answers.get(question.id) === question.answer) correctCount += 1;
  });

  const score = Math.round((correctCount / questions.length) * 100);
  resultText.textContent = `${questions.length}문항 중 ${correctCount}문항 정답입니다. 예상 점수는 ${score}점입니다.`;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function submitExam() {
  questions.forEach((question) => {
    if (answers.get(question.id) !== question.answer) {
      saveWrongNote(question, activeCertificate);
    }
  });
  showResult();
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  return response.json();
}

async function initQuiz() {
  try {
    const certificates = await loadJson("./data/certificates.json");
    activeCertificate = certificates.find((item) => item.id === certificateId);

    if (!activeCertificate || activeCertificate.status !== "active") {
      renderEmpty("아직 준비 중인 자격증입니다.");
      return;
    }

    questions = await loadJson(`./data/questions/${activeCertificate.id}.json`);
    document.title = `${activeCertificate.name} 무료 모의고사 - 퀵합격`;
    quizEyebrow.textContent = mode === "exam" ? `${activeCertificate.name} 실전풀이` : `${activeCertificate.name} 학습풀이`;
    const set = (activeCertificate.sets || []).find((item) => item.id === setId);
    quizTitle.textContent = set ? set.title : `${activeCertificate.name} 예상문제`;
    quizSummary.textContent = mode === "exam" ? "끝까지 푼 뒤 채점" : "정답과 해설을 바로 확인";
    navCertificateLink.href = `./certificate.html?id=${activeCertificate.id}`;

    renderQuiz(activeCertificate);
    updateProgress();
  } catch (error) {
    renderEmpty(error.message);
  }
}

retryButton.addEventListener("click", () => {
  answers.clear();
  checkedAnswers.clear();
  resultPanel.hidden = true;
  updateProgress();
  if (activeCertificate) renderQuiz(activeCertificate);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

submitExamButton.addEventListener("click", submitExam);

initQuiz();
