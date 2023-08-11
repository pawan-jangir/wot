$document.ready
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
    // updateProgressbar();
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

  // for (let i = 0; i < formStepsNum; i++) {
  //   step_buttons[i].classList.add("step_button_active");
  // }

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

const list1 = document.getElementById("myUL");
const items = document.querySelectorAll("#myUL li");
const select_buyer_input = document.getElementById("select_buyer");

const list2 = document.getElementById("myUL2");
const items2 = document.querySelectorAll("#myUL2 li");
const select_seller_input = document.getElementById("select_seller");

const list3 = document.getElementById("myUL3");
const items3 = document.querySelectorAll("#myUL3 li");
const escripNumbers = document.getElementById("escripNum");

items.forEach((item) => {
  let insideText = item.getAttribute("data-value");
  item.addEventListener("click", function () {
    select_buyer_input.value = insideText;
    list1.style.display = "none";
  });
});

items2.forEach((item) => {
  let insideText = item.getAttribute("data-value");
  item.addEventListener("click", function () {
    select_seller_input.value = insideText;
    list2.style.display = "none";
  });
});

items3.forEach((item) => {
  let insideText = item.getAttribute("data-value");
  item.addEventListener("click", function () {
    escripNumbers.value = insideText;
    list3.style.display = "none";
  });
});

document.body.addEventListener("click", function () {
  list1.style.display = "none";
  list2.style.display = "none";
  list3.style.display = "none";
});

function myFunction() {
  // Declare variables
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("select_buyer");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  ul.style.display = "block";
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function myFunction2() {
  // Declare variables
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("select_seller");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL2");
  ul.style.display = "block";
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function myFunction3() {
  // Declare variables
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("escripNum");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL3");
  ul.style.display = "block";
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

const db = {
  clients: ["aman", "shubh"],
  countries: ["india", "usa"],
};

var input = document.getElementById("date_of_agreement");
var input2 = document.getElementById("issueDate");
var today = new Date();
input.value = today.toISOString().split("T")[0];

var fiveDaysAgo = new Date();
fiveDaysAgo.setDate(today.getDate() - 5);
console.log(today, fiveDaysAgo);

input.min = fiveDaysAgo.toISOString().split("T")[0];
input.max = today.toISOString().split("T")[0];
input2.max = today.toISOString().split("T")[0];

//js grid

(function ($) {
  "use strict";
  $(function () {
    //basic config
    if ($("#scrip_details").length) {
      $("#scrip_details").jsGrid({
        height: "500px",
        width: "100%",
        filtering: true,
        editing: true,
        inserting: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 15,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete the client?",
        data: db.clients,
        fields: [
          {
            name: "E-Scrip Number",
            type: "text",
            // width: 50,
          },
          {
            name: "Type",
            type: "text",
            // width: 50,
          },
          {
            name: "Issue Date",
            type: "text",
            // width: 100,
          },
          {
            name: "Port Code",
            type: "text",
          },
          {
            name: "Original Owner",
            type: "text",
          },
          {
            name: "(Scrip Bal.) Value (Rs.)",
            type: "text",
          },
          {
            name: "Rate %",
            type: "text",
          },
          {
            name: "Amount (Rs.)",
            type: "text",
          },
          {
            type: "control",
            width: 100,
          },
        ],
      });
    }
  });
})(jQuery);

const BoxModal = document.querySelector(".box-modal");
const InnerBodyModal = document.querySelector(".inner-body-modal");
const Overlay = document.querySelector(".overlay");
const customBtn = document.querySelector(".customBtn");

const showPopUp = document.querySelector(".preview_button button");
const removePopUp = document.getElementById("remove-pop");

removePopUp.addEventListener("click", function () {
  document.body.classList.remove("active-modal");
  BoxModal.classList.remove("modal-show");
});

showPopUp.addEventListener("click", function () {
  document.body.classList.add("active-modal");
  BoxModal.classList.add("modal-show");
});

Overlay.addEventListener("click", function () {
  document.body.classList.remove("active-modal");
  BoxModal.classList.remove("modal-show");
});

let digitValidate = function (ele) {
  console.log(ele.value);
  ele.value = ele.value.replace(/[^0-9]/g, "");
};

let tabChange = function (val) {
  let ele = document.querySelectorAll("input");
  if (ele[val - 1].value != "") {
    ele[val].focus();
  } else if (ele[val - 1].value == "") {
    ele[val - 2].focus();
  }
};

const rejectReasonBox = document.querySelector(".reject-reason");
const rejectBtn = document.getElementById("reject-btn");

rejectBtn.addEventListener("click", function () {
  rejectReasonBox.style.display = "block";
});
