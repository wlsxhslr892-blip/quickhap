const homeCertificateList = document.querySelector("#homeCertificateList");
const homeSearchForm = document.querySelector("#homeSearchForm");
const homeSearchInput = document.querySelector("#homeSearchInput");

let certificates = [];

async function loadCertificates() {
  const response = await fetch("./data/certificates.json");
  if (!response.ok) throw new Error("자격증 목록을 불러오지 못했습니다.");
  return response.json();
}

function renderHomeList(items) {
  homeCertificateList.innerHTML = items.map((certificate) => {
    const active = certificate.status === "active";
    const label = active ? "문제풀기" : "준비중";
    const body = `
      <span>${certificate.level}</span>
      <strong>${certificate.name}</strong>
      <em>${label}</em>
    `;

    if (active) {
      return `<a class="list-link" href="./certificate.html?id=${certificate.id}">${body}</a>`;
    }

    return `<div class="list-link disabled">${body}</div>`;
  }).join("");
}

homeSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = homeSearchInput.value.trim();
  const results = keyword
    ? certificates.filter((item) => item.name.includes(keyword))
    : certificates;
  renderHomeList(results);
});

loadCertificates()
  .then((items) => {
    certificates = items;
    renderHomeList(certificates);
  })
  .catch((error) => {
    homeCertificateList.innerHTML = `<p>${error.message}</p>`;
  });
