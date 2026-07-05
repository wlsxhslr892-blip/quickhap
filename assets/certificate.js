const params = new URLSearchParams(window.location.search);
const certificateId = params.get("id") || "wihummul-gineungsa";

const certificateLevel = document.querySelector("#certificateLevel");
const certificateTitle = document.querySelector("#certificateTitle");
const certificateSummary = document.querySelector("#certificateSummary");
const examSetList = document.querySelector("#examSetList");

async function loadCertificates() {
  const response = await fetch("./data/certificates.json");
  if (!response.ok) throw new Error("자격증 정보를 불러오지 못했습니다.");
  return response.json();
}

function renderSets(certificate) {
  const sets = certificate.sets || [
    {
      id: "set-01",
      title: `${certificate.name} 1회`,
      description: "기출유형 기반 자체 제작 60문제",
      questionCount: 60
    }
  ];

  examSetList.innerHTML = sets.map((set, index) => `
    <article class="exam-set">
      <span>${index + 1}</span>
      <strong>${set.title}</strong>
      <em>${set.description}</em>
      <div class="set-actions">
        <a href="./quiz.html?id=${certificate.id}&set=${set.id}&mode=exam">실전풀이</a>
        <a href="./quiz.html?id=${certificate.id}&set=${set.id}&mode=study">학습풀이</a>
      </div>
    </article>
  `).join("");
}

function renderCertificate(certificate) {
  document.title = `${certificate.name} CBT 문제풀이 - 퀵합격`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${certificate.name} CBT 문제풀이와 오답노트를 퀵합격에서 시작하세요.`);
  }

  certificateLevel.textContent = certificate.level;
  certificateTitle.textContent = `${certificate.name} CBT 문제풀이`;
  certificateSummary.textContent = "회차를 선택하세요.";
  renderSets(certificate);
}

function renderNotReady() {
  certificateTitle.textContent = "아직 준비 중인 자격증입니다.";
  certificateSummary.textContent = "콘텐츠가 준비되면 목록에서 문제풀이를 시작할 수 있습니다.";
  examSetList.innerHTML = `<a class="exam-set" href="./certifications.html"><span>←</span><strong>자격증 목록 보기</strong><em>준비된 자격증을 선택하세요.</em></a>`;
}

loadCertificates()
  .then((certificates) => {
    const certificate = certificates.find((item) => item.id === certificateId);
    if (!certificate || certificate.status !== "active") {
      renderNotReady();
      return;
    }
    renderCertificate(certificate);
  })
  .catch(() => renderNotReady());
