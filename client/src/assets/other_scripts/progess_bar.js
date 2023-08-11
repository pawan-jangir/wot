const steps_dom = document.querySelector(".steps");
// console.log(steps_dom.parentNode);
//referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

const div = document.createElement("div");
div.className = "progressbar";

div.innerHTML = `
    <div class="progress" id="progress"></div>
    <div
      class="progress-step progress-step-active"
      data-title="Customer Info"
    ></div>
    <div class="progress-step" data-title="Business Details"></div>
    <div class="progress-step" data-title="Bank Details"></div>
    <div class="progress-step" data-title="Other Documents"></div>
    <div class="progress-step" data-title="Consent"></div>
    `;

// console.log(div);

steps_dom.parentNode.insertBefore(div, steps_dom.nextSibling);

// const prevBtns = document.querySelectorAll(".btn-prev");
// const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

const nextBtn = document.querySelector(".actions li:nth-child(2)");
const prevBtn = document.querySelector(".actions li:nth-child(1)");

nextBtn.addEventListener("click", () => {
  formStepsNum++;

  updateProgressbar();
});

prevBtn.addEventListener("click", () => {
  if (formStepsNum > 0) {
    formStepsNum--;
    updateProgressbar();
  }
});

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

const stepsList = document.querySelector(".steps ul");
console.log(stepsList);

stepsList.style.display = "flex";
stepsList.style.width = "100%";
stepsList.style.overflowX = "scroll";
// stepsList.style.flexWrap = "wrap";
