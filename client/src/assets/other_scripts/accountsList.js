// const allTds = document.querySelectorAll("td");
// const allThs = document.querySelectorAll("th");
// const accountNumbers = document.querySelectorAll("tbody tr td:nth-child(2)");

// allTds.forEach((td) => {
//   td.style.fontSize = "16px";
// });

// allThs.forEach((th) => {
//   th.style.fontSize = "20px";
// });

// accountNumbers.forEach((accNum) => {
//   accNum.style.fontWeight = "600";
//   accNum.style.color = "purple";
// });

// const inputs = document.querySelectorAll(".card input");
// console.log(inputs);

// searchInput[1].placeholder = "Search by Account Name";

(function ($) {
  "use strict";
  $(function () {
    $("#account-listing").DataTable({
      aLengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, "All"],
      ],
      iDisplayLength: 10,
      language: {
        search: "",
      },
    });
    $("#account-listing").each(function () {
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
