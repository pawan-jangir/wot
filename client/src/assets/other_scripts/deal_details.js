(function ($) {
  "use strict";
  $(function () {
    //basic config

    if ($("#scrip-static").length) {
      $("#scrip-static").jsGrid({
        height: "200px",
        width: "100%",

        sorting: true,
        paging: true,

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
        ],

        // fields: [
        //   {
        //     name: "Name",
        //     type: "text",
        //     width: 150,
        //   },
        //   {
        //     name: "Age",
        //     type: "number",
        //     width: 50,
        //   },
        //   {
        //     name: "Address",
        //     type: "text",
        //     width: 200,
        //   },
        //   {
        //     name: "Country",
        //     type: "select",
        //     items: db.countries,
        //     valueField: "Id",
        //     textField: "Name",
        //   },
        //   {
        //     name: "Married",
        //     title: "Is Married",
        //   },
        // ],
      });
    }
  });
})(jQuery);

var db = {
  clients: [],
  countries: [],
};
