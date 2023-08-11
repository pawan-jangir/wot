const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  icon: {
    type: String,
  },
  baseprice: {
    type: Number,
  },
  addonlogoprice: {
    type: Number,
  },
  sparecardprice: {
    type: Number,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
  },
  tax_class: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

module.exports = mongoose.model("Product", Schema);
