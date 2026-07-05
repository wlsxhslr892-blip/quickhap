const adParams = new URLSearchParams(window.location.search);

if (adParams.get("ads") === "1") {
  document.body.classList.add("show-ad-placeholders");
}
