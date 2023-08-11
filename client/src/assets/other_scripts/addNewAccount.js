const steps = document.querySelectorAll(".step-button");
const sections = document.querySelectorAll(".step-section");

// console.log(sections, steps);

steps.forEach((step) => {
  step.addEventListener("click", () => {
    // sections[0].style.display = null;
    let index = +step.value;

    if (!step.classList.contains("active")) {
      step.classList.add("active");
      removeOtherActives(step);
    }

    if (!sections[index].style.display) {
      hideIfAlreadyblock(sections[index]);
      sections[index].style.display = "block";
    }
  });
});

function removeOtherActives(stepNode) {
  steps.forEach((step) => {
    if (step.classList.contains("active") && !step.isSameNode(stepNode)) {
      step.classList.remove("active");
    }
  });
}

function hideIfAlreadyblock(sectionNode) {
  sections.forEach((section) => {
    if (section.style.display && !section.isSameNode(sectionNode)) {
      section.style.display = null;
    }
  });
}

const next1 = document.querySelector(".next-btn-1");
moveToLinkPayee();

function moveToLinkPayee() {
  next1.addEventListener("click", () => {
    removeOtherActives();
    steps[1].classList.add("active");
    sections[0].style.display = null;
    sections[1].style.display = "block";
  });
}

const next2 = document.querySelector(".next-btn-2");
moveToDocuments();

function moveToDocuments() {
  next2.addEventListener("click", () => {
    removeOtherActives();
    steps[2].classList.add("active");
    sections[1].style.display = null;
    sections[2].style.display = "block";
  });
}

(function ($) {
  "use strict";
  $(function () {
    $("#docs").DataTable({
      aLengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, "All"],
      ],
      iDisplayLength: 10,
      language: {
        search: "",
      },
    });
    $("#docs").each(function () {
      var datatable = $(this);
      // SEARCH - Add the placeholder for Search and Turn this into in-line form control
      var search_input = datatable
        .closest(".dataTables_wrapper")
        .find("div[id$=_filter] input");
      search_input.attr("placeholder", "Search");
      search_input.removeClass("form-control-sm");
      // LENGTH - Inline-Form control
      var length_sel = datatable
        .closest(".dataTables_wrapper")
        .find("div[id$=_length] select");
      length_sel.removeClass("form-control-sm");
    });
  });
})(jQuery);

(function ($) {
  "use strict";
  $(function () {
    $("#link_payee").DataTable({
      aLengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, "All"],
      ],
      iDisplayLength: 10,
      language: {
        search: "",
      },
    });
    $("#link_payee").each(function () {
      var datatable = $(this);
      // SEARCH - Add the placeholder for Search and Turn this into in-line form control
      var search_input = datatable
        .closest(".dataTables_wrapper")
        .find("div[id$=_filter] input");
      search_input.attr("placeholder", "Search");
      search_input.removeClass("form-control-sm");
      // LENGTH - Inline-Form control
      var length_sel = datatable
        .closest(".dataTables_wrapper")
        .find("div[id$=_length] select");
      length_sel.removeClass("form-control-sm");
    });
  });
})(jQuery);

const toggler = document.querySelector(".toggler");
const toggleContainer = document.querySelector(".toggler_circle_container");

toggleContainer.addEventListener("click", () => {
  toggler.classList.toggle("on");
  if (toggler.classList.contains("on")) {
    toggleContainer.style.justifyContent = "flex-end";
  } else {
    toggleContainer.style.justifyContent = "flex-start";
  }
});
