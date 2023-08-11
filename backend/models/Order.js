const mongoose = require("mongoose");


const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default:null
  },
  razorpay_order_id: {
    type: String,
    default: null,
  },
  razorpay_payment_id: {
    type: String,
    default: null,
  },
  razorpay_signature: {
    type: String,
    default: null,
  },
  order_id: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  grandTotal: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    require: true,
    default: "INR",
  },
  receipt_id: {
    type: String,
    require: true,
  },
  unique_id: {
    type: String,
    default : null
  },
  email: {
    type: String,
    default : null
  },
  password: {
    type: String,
    default : null
  },
  fullname: {
    type: String,
    default : null
  },
  phone: {
    type: String,
    default : null
  },
  house_no: {
    type: String,
    default : null
  },
  city: {
    type: String,
    default : null
  },
  postal_code: {
    type: String,
    default : null
  },
  region: {
    type: String,
    default : null
  },
  product: {
    type: {},
    default : {}
  },
  cart: {
    type: {},
    default : {}
  },
  discountObj: {
    type: {},
    default : {}
  },
  status: {
    type: String,
    require: true,
    default: "created",
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", schema);
