const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  coupon_code: {
    type: String,
    default:null
  },
  type: {
    type: String,
    default:null
  },
  type_value: {
    type: Number,
    default:0
  },
  expiry_date: {
    type: Date,
    default: new Date(),
  },
},{timestamps:true});

module.exports = mongoose.model("Coupon", schema);
