const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    default: 0,
    required: true,
  },
  transaction_type: {
    type: String,
    default: "",
    required: true,
  },
  transaction_id: {
    type: String,
    default: "",
    required: true,
  },
  source: {
    type: String,
    default: "",
    required: true,
  },
  bank_name: {
    type: String,
    default: "",
  },
  account_number: {
    type: String,
    default: "",
  },
  ifsc_code: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 1,
  },
  last_status_update_date: {
    type: Date,
    default: new Date(),
  },
  note: {
    type: String,
    default: "",
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
},{timestamps:true});

module.exports = mongoose.model("WalletTransaction", schema);
