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
    // updateProgressbar();
    updateStepButton();

    // for (let i = 0; i < step_buttons.length; i++) {
    //   if (
    //     !step_buttons[i].isSameNode(this) &&
    //     step_buttons[i].classList.contains("step_button_active")
    //   ) {
    //     step_buttons[i].classList.remove("step_button_active");
    //   }
    // }
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
  step_buttons[formStepsNum].disabled = false;
  // step_buttons.forEach((stepButton) => {
  //   stepButton.classList.contains("step_button_active") &&
  //     stepButton.classList.remove("step_button_active");
  // });

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

const dropAreas = document.querySelectorAll(".drop_box");

dropAreas.forEach((dropArea) => {
  const button = dropArea.lastElementChild;
  const input = dropArea.children[1];
  // console.log(button, input);
  button.onclick = () => {
    input.click();
  };

  input.addEventListener("change", function (e) {
    var fileName = e.target.files[0].name;
    let filedata = `
      <form action="" method="post">
      <div class="form">
      <h4>${fileName}</h4>
  
      <button class="btn">Upload</button>
      </div>
      </form>`;
    dropArea.innerHTML = filedata;
  });
});

const verifyPhone = document.querySelector(".verify-phone");
const verifyEmail = document.querySelector(".verify-email");

const phoneBoxModal = document.querySelector(".phone-box-modal");
const phoneInnerBodyModal = document.querySelector(".phone-inner-body-modal");
const phoneOverlay = document.querySelector(".phone-overlay");
const customBtnPhone = document.querySelector(".customBtnPhone");

const emailBoxModal = document.querySelector(".email-box-modal");
const emailInnerBodyModal = document.querySelector(".email-inner-body-modal");
const emailOverlay = document.querySelector(".email-overlay");
const customBtnEmail = document.querySelector(".customBtnEmail");

const mobile_field = document.getElementById("contact_person_mobile");
const email_field = document.getElementById("contact_person_email");

verifyPhone.addEventListener("click", function () {
  document.body.classList.add("active-modal");
  phoneBoxModal.classList.add("phone-modal-show");
});

verifyEmail.addEventListener("click", function () {
  document.body.classList.add("active-modal");
  emailBoxModal.classList.add("email-modal-show");
});

phoneOverlay.addEventListener("click", function () {
  document.body.classList.remove("active-modal");
  phoneBoxModal.classList.remove("phone-modal-show");
});

emailOverlay.addEventListener("click", function () {
  document.body.classList.remove("active-modal");
  emailBoxModal.classList.remove("email-modal-show");
});

customBtnPhone.addEventListener("click", function () {
  phoneInnerBodyModal.innerHTML = `<div class="title" style="color: green">Verification Successful!!</div>`;
  mobile_field.disabled = true;
  verifyPhone.style.backgroundColor = "rgba(57, 44, 112, 0.7)";
  verifyPhone.disabled = true;
});

customBtnEmail.addEventListener("click", function () {
  emailInnerBodyModal.innerHTML = `<div class="title" style="color: green">Verification Successful!!</div>`;
  email_field.disabled = true;
  verifyEmail.style.backgroundColor = "rgba(57, 44, 112, 0.7)";
  verifyEmail.disabled = true;
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

function searchFunction() {
  document.getElementById("search_content").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("searchable_dropdown_input");
  filter = input.value.toUpperCase();
  div = document.getElementById("search_content");
  a = div.getElementsByTagName("li");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "block";
    } else {
      a[i].style.display = "none";
    }
  }
}

const BANKS = [
  "AB Bank Ltd.",
  "Abu Dhabi Commercial Bank Ltd.",
  "Airtel Payments Bank Limited",
  "American Express Banking Corporation",
  "Andhra Pradesh Grameena Vikas Bank",
  "Andhra Pragathi Grameena Bank",
  "Arunachal Pradesh Rural Bank",
  "Aryavart Bank",
  "Assam Gramin Vikash Bank",
  "Au Small Finance Bank Limited",
  "Australia and New Zealand Banking Group Ltd.",
  "Axis Bank Ltd.",
  "Bandhan Bank Ltd.",
  "Bangiya Gramin Vikas Bank",
  "Bank of America",
  "Bank of Bahrain & Kuwait BSC",
  "Bank of Baroda",
  "Bank of Ceylon",
  "Bank of China",
  "Bank of India",
  "Bank of Maharashtra",
  "Bank of Nova Scotia",
  "Barclays Bank Plc.",
  "Baroda Gujarat Gramin Bank",
  "Baroda Rajasthan Kshetriya Gramin Bank",
  "Baroda UP Bank",
  "BNP Paribas",
  "Canara Bank",
  "Capital Small Finance Bank Limited",
  "Central Bank of India",
  "Chaitanya Godavari Grameena Bank",
  "Chhattisgarh Rajya Gramin Bank",
  "Citibank N.A.",
  "City Union Bank Ltd.",
  "Cooperatieve Rabobank U.A.",
  "Credit Agricole Corporate & Investment Bank",
  "Credit Suisse A.G",
  "CSB Bank Ltd.",
  "CTBC Bank Co.",
  "Dakshin Bihar Gramin Bank",
  "DBS Bank India Limited*",
  "DCB Bank Ltd.",
  "Deutsche Bank",
  "Dhanlaxmi Bank Ltd.",
  "Doha Bank Q.P.S.C",
  "Ellaquai Dehati Bank",
  "Emirates Bank NBD",
  "Equitas Small Finance Bank Limited",
  "ESAF Small Finance Bank Limited",
  "Federal Bank Ltd.",
  "Fincare Small Finance Bank Limited",
  "Fino Payments Bank Limited",
  "First Abu Dhabi Bank PJSC",
  "FirstRand Bank Ltd",
  "HDFC Bank Ltd",
  "Himachal Pradesh Gramin Bank",
  "HSBC Ltd",
  "ICICI Bank Ltd.",
  "IDBI Bank Ltd.",
  "IDFC First Bank Ltd.",
  "India Post Payments Bank Limited",
  "Indian Bank",
  "Indian Overseas Bank",
  "Induslnd Bank Ltd",
  "Industrial & Commercial Bank of China Ltd.",
  "Industrial Bank of Korea",
  "J&K Grameen Bank",
  "J.P. Morgan Chase Bank N.A.",
  "Jammu & Kashmir Bank Ltd.",
  "Jana Small Finance Bank Limited",
  "Jharkhand Rajya Gramin Bank",
  "JSC VTB Bank",
  "Karnataka Bank Ltd.",
  "Karnataka Gramin Bank",
  "Karnataka Vikas Grameena Bank",
  "Karur Vysya Bank Ltd.",
  "KEB Hana Bank",
  "Kerala Gramin Bank",
  "Kookmin Bank",
  "Kotak Mahindra Bank Ltd",
  "Krung Thai Bank Public Co. Ltd.",
  "Madhya Pradesh Gramin Bank",
  "Madhyanchal Gramin Bank",
  "Maharashtra Gramin Bank",
  "Manipur Rural Bank",
  "Mashreq Bank PSC",
  "Meghalaya Rural Bank",
  "Mizoram Rural Bank",
  "Mizuho Bank Ltd.",
  "MUFG Bank",
  "Nagaland Rural Bank",
  "Nainital Bank Ltd.",
  "NatWest Markets Plc",
  "North East Small Finance Bank Limited",
  "Odisha Gramya Bank",
  "Paschim Banga Gramin Bank",
  "Paytm Payments Bank Limited",
  "Prathama UP Gramin Bank",
  "PT Bank Maybank Indonesia TBK",
  "Puduvai Bharathiar Grama Bank",
  "Punjab & Sind Bank",
  "Punjab Gramin Bank",
  "Punjab National Bank",
  "Qatar National Bank (Q.P.S.C.)",
  "Rajasthan Marudhara Gramin Bank",
  "RBL Bank Ltd.",
  "Saptagiri Grameena Bank",
  "Sarva Haryana Gramin Bank",
  "Saurashtra Gramin Bank",
  "Sberbank",
  "SBM Bank (India) Limited*",
  "Shinhan Bank",
  "Shivalik Small Finance Bank Limited",
  "Societe Generale",
  "Sonali Bank Ltd.",
  "South Indian Bank Ltd.",
  "Standard Chartered Bank",
  "State Bank of India",
  "Sumitomo Mitsui Banking Corporation",
  "Suryoday Small Finance Bank Limited",
  "Tamil Nadu Grama Bank",
  "Tamilnad Mercantile Bank Ltd.",
  "Telangana Grameena Bank",
  "Tripura Gramin Bank",
  "UCO Bank",
  "Ujjivan Small Finance Bank Limited",
  "Union Bank of India",
  "United Overseas Bank Ltd",
  "Unity Small Finance Bank Limited",
  "Utkal Grameen bank",
  "Utkarsh Small Finance Bank Limited",
  "Uttar Bihar Gramin Bank",
  "Uttarakhand Gramin Bank",
  "Uttarbanga Kshetriya Gramin Bank",
  "Vidharbha Konkan Gramin Bank",
  "Woori Bank",
  "YES Bank Ltd.",
];

BANKS.forEach((bank) => {
  let parent = document.querySelector("#bank_search_content ul");
  let htmlCode = `<li data-value="${bank}">${bank}</li>`;
  parent.innerHTML += htmlCode;
});

function bankSearchFunction() {
  document.getElementById("bank_search_content").classList.toggle("show");
}

function bankFilterFunction() {
  let input, filter, ul, li, a, i;
  input = document.getElementById("bank_searchable_dropdown_input");
  filter = input.value.toUpperCase();
  div = document.getElementById("bank_search_content");
  a = div.getElementsByTagName("li");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "block";
    } else {
      a[i].style.display = "none";
    }
  }
}

const stateSearchBtn = document.querySelector(".searchable_dropdown_btn");
const states = document.querySelectorAll(".search_content li");

states.forEach((state) => {
  let stateName = state.getAttribute("data-value");
  state.addEventListener("click", function () {
    stateSearchBtn.innerHTML = `${stateName} <i class="fa-solid fa-chevron-down"></i>`;
    document.getElementById("search_content").classList.toggle("show");
  });
});

const banksSearchBtn = document.querySelector(".bank_searchable_dropdown_btn");
const banks = document.querySelectorAll(".bank_search_content li");

banks.forEach((bank) => {
  let bankName = bank.getAttribute("data-value");
  bank.addEventListener("click", function () {
    stateSearchBtn.innerHTML = `${bankName} <i class="fa-solid fa-chevron-down"></i>`;
    document.getElementById("search_content").classList.toggle("show");
  });
});

//add more signatory
const addMoreSignatoryBtn = document.getElementById("add_more_signatory");
const parentDiv = document.querySelector(".authorize_signatory_container");

let fieldSets = parentDiv.children.length;
console.log(fieldSets, parentDiv.children);

addMoreSignatoryBtn.addEventListener("click", function () {
  fieldSets++;
  console.log(fieldSets, parentDiv.children);
  parentDiv.innerHTML += `<fieldset>
  <legend>Authorize Signatory ${fieldSets}</legend>
  <div>
    <label
      >Authorize Signatory Name
      </label
    >
    <input
      type="text"
      class="form-control"
      placeholder="Authorize Signatory Name"
      
    />
  </div>
  <div>
    <label
      >Authorize Signatory PAN
      </label
    >
    <input
      type="text"
      class="form-control"
      placeholder="Authorize Signatory PAN"
      
    />
  </div>
  <div>
    <label style="font-size: 16px">Upload Document for PAN</label>
    <div class="drop_box">
      <header>Select File</header>
      <input
        type="file"
        hidden
        accept="*"
        id="fileID"
        style="display: none"
        required
      />
      <button class="btn_upload">Choose File</button>
    </div>
  </div>
  <button type="button">Remove</button>
</fieldset>`;
});

//remove specific signatory

// const removeSignatoryButtons = document.querySelectorAll(
//   ".authorize_signatory_container fieldset button"
// );
// let divToBeRemoved = 0;
// console.log(removeSignatoryButtons);

// removeSignatoryButtons.forEach((btn, idx) => {
//   btn.addEventListener("click", function () {
//     divToBeRemoved = idx + 1;
//     console.log(parentDiv.children[divToBeRemoved].innerHTML);
//   });
// });
