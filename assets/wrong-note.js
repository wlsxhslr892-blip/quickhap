const wrongNoteList = document.querySelector("#wrongNoteList");

function loadWrongNotes() {
  try {
    return JSON.parse(localStorage.getItem("quickpassWrongNotes") || "[]");
  } catch {
    return [];
  }
}

function renderWrongNotes() {
  const notes = loadWrongNotes();

  if (notes.length === 0) {
    wrongNoteList.innerHTML = `
      <article class="question-card">
        <h2>저장된 오답이 없습니다.</h2>
        <p>모의고사를 풀고 틀린 문제를 다시 확인해보세요.</p>
        <a class="button primary" href="./quiz.html?id=wihummul-gineungsa">모의고사 풀기</a>
      </article>
    `;
    return;
  }

  wrongNoteList.innerHTML = notes.map((note) => `
    <article class="question-card">
      <p class="eyebrow">${note.certificateName || "퀵합격"} · ${note.concept}</p>
      <h2>${note.title}</h2>
      <div class="explanation">${note.explanation}</div>
    </article>
  `).join("");
}

renderWrongNotes();
