const ctx = new AudioContext();

const code = document.querySelector('.code');

const btnCode = document.querySelector("#code");
btnCode.addEventListener("click", () => {
  console.info('?', code.classList.contains("hide"));
  if (code.classList.contains("hide")) {
    btnCode.textContent = "hide code";
  }
  else {
    btnCode.textContent = "show code";
  }
  code.classList.toggle("hide");
});