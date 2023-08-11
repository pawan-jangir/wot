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
  game_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameType",
  },
  session: {
    type: String,
  },
  amount: {
    type: Number,
  },
  number: {
    type: Number,
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString(), // + ", " + new Date().toLocaleTimeString(),
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
module.exports = mongoose.model("Bid", schema);
