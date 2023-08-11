const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  upi_id: {
    type: String,
  },
  merchant_id: {
    type: String,
  },
  min_betting_rate: {
    type: String,
  },
  min_withdrwal_rate: {
    type: String,
  },
  max_withdrwal_rate: {
    type: String,
  },
  min_deposit_rate: {
    type: String,
  },
  max_deposit_rate: {
    type: String,
  },

  minimum_transfer: {
    type: String,
  },
  maximum_transfer: {
    type: String,
  },
  minimum_bid_amount: {
    type: String,
  },
  maximum_bid_amount: {
    type: String,
  },
  welcome_bonus: {
    type: String,
  },
  account_holder_name: {
    type: String,
  },
  account_number: {
    type: String,
  },
  ifsc_code: {
    type: String,
  },
  app_link: {
    type: String,
  },
  msg: {
    type: String,
  },
  home_title_1: {
    type: String,
  },

  home_title_2: {
    type: String,
  },
  upi_name: {
    type: String,
  },
  upi_payment_id: {
    type: String,
  },
  upi_paytm_id: {
    type: String,
  },
  upi_phonepay_id: {
    type: String,
  },
  upi_googlepay_id: {
    type: String,
  },
  market_open_time: {
    type: String,
  },
  alert_message: {
    type: String,
  },

  created_at: {
    type: String,
    default: Date(),
  },
});

module.exports = mongoose.model("Setting", schema);
