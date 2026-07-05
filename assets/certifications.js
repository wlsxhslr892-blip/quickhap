const certificateGrid = document.querySelector("#certificateGrid");

async function loadCertificates() {
  const response = await fetch("./data/certificates.json");
  if (!response.ok) throw new Error("자격증 목록을 불러오지 못했습니다.");
  return response.json();
}

function renderCertificates(certificates) {
  certificateGrid.innerHTML = certificates.map((certificate) => {
    const isActive = certificate.status === "active";
    const tag = isActive ? "학습 가능" : "준비 중";
    const className = isActive ? "category-card active" : "category-card";
    const body = `
      <span>${tag}</span>
      <strong>${certificate.name}</strong>
      <p>${certificate.summary}</p>
    `;

    if (isActive) {
      return `<a class="${className}" href="./certificate.html?id=${certificate.id}">${body}</a>`;
    }

    return `<div class="${className}">${body}</div>`;
  }).join("");
}

loadCertificates()
  .then(renderCertificates)
  .catch((error) => {
    certificateGrid.innerHTML = `
      <article class="question-card">
        <h2>${error.message}</h2>
        <p>잠시 후 다시 시도해주세요.</p>
      </article>
    `;
  });
