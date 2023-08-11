const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  market_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },
  // game_type_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "GameType",
  // },
  result_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Result",
  },
  winning_amount: {
    type: Number,
  },
  created_at: {
    type: String,
    default: new Date().toLocaleDateString(), // + ", " + new Date().toLocaleTimeString(),
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
},{timestamps:true});

module.exports = mongoose.model("Winning", schema);
