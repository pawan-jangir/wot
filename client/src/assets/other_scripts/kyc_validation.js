// let entityType;

// function changedEntity() {
//   entityType = document.querySelector(".entity-type-select");
//   console.log(entityType.value);
// }

// function checkOptionalCIN() {
//   if (entityType == "Partnership" || entityType == "Proprietor") {
//     document.getElementById("business-cin").required = false;
//   }
// }

// const stepsList = document.querySelector(".steps ul");
// console.log(stepsList);

// stepsList.style.display = "flex";
// stepsList.style.width = "100%";
// stepsList.style.justifyContent = "space-around";
// // stepsList.style.flexWrap = "wrap";

const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

const step_buttons = document.querySelectorAll(".step_button");
let formStepsNum = 0;

step_buttons.forEach((btn, i) => {
  btn.addEventListener("click", function () {
    this.classList.add("step_button_active");

    formStepsNum = i;
    updateFormSteps();
    updateProgressbar();
    updateStepButton();

    for (let i = 0; i < step_buttons.length; i++) {
      if (
        !step_buttons[i].isSameNode(this) &&
        step_buttons[i].classList.contains("step_button_active")
      ) {
        step_buttons[i].classList.remove("step_button_active");
      }
    }
  });
});

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    updateStepButton();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
    updateStepButton();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateStepButton() {
  // step_buttons[formStepsNum].disabled = false;
  step_buttons.forEach((stepButton) => {
    stepButton.classList.contains("step_button_active") &&
      stepButton.classList.remove("step_button_active");
  });

  for (let i = 0; i < formStepsNum; i++) {
    step_buttons[i].classList.add("step_button_active");
  }

  step_buttons[formStepsNum].classList.add("step_button_active");
}

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
