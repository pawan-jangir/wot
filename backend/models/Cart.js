const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  unique_id: {
    type: String,
    default:null
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  amount: {
    type: Number,
    default: 0,
  },
  cardUsrFirstName: {
    type: String,
    default: "",
  },
  cardUsrLastName: {
    type: String,
    default: "",
  },
  cardNameUser: {
    type: String,
    default: "",
  },
  companyName: {
    type: String,
    default: "",
  },
  selectedColor: {
    type: String,
    default: "",
  },
  cardDocument: {
    type: String,
    default: "",
  },
  companyLogo: {
    type: String,
    default: "",
  },
  islogoAdded: {
    type: Boolean,
    default: false,
  },
  isSparePartAdded: {
    type: Boolean,
    default: false,
  },
  product: {
    type: {},
    default: {},
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
},{timestamps:true});

module.exports = mongoose.model("Cart", schema);
