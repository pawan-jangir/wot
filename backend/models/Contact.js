const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  full_name: {
    type: String,
    max: 50,
  },
  email: {
    type: String,
    max: 50,
    default: null,
  },
  mobile_number: {
    type: String,
    default: null,
  },
  company_name: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
},{
  timestamps : true
});

module.exports = mongoose.model("Contact", Schema);
