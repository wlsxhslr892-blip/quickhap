const favoriteList = document.querySelector("#favoriteList");

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("quickpassFavorites") || "[]");
  } catch {
    return [];
  }
}

function renderFavorites() {
  const favorites = loadFavorites();

  if (favorites.length === 0) {
    favoriteList.innerHTML = `
      <article class="question-card">
        <h2>저장된 즐겨찾기가 없습니다.</h2>
        <p>문제풀이 중 어려운 문제를 즐겨찾기에 추가해보세요.</p>
        <a class="button primary" href="./quiz.html?id=wihummul-gineungsa">문제 풀기</a>
      </article>
    `;
    return;
  }

  favoriteList.innerHTML = favorites.map((item) => `
    <article class="question-card">
      <p class="eyebrow">${item.certificateName || "퀵합격"} · ${item.concept}</p>
      <h2>${item.title}</h2>
      <div class="explanation">${item.explanation}</div>
    </article>
  `).join("");
}

renderFavorites();
