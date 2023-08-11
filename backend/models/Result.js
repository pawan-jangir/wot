const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  // game_type_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "GameType",
  // },
  market_session: {
    type: String,
  },
  date: {
    type: String,
    // default: new Date().toLocaleDateString()
  },
  market_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },
  digit: {
    type: Number,
  },
  result_number: {
    type: Number,
    default: 0,
  },
  open_pana: {
    type: Object,
    default: {},
  },
  close_pana: {
    type: Object,
    default: {},
  },
  is_result_declared: {
    type: Number,
    default: 0,
  },
  created_stamp: {
    type: Number,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

module.exports = mongoose.model("Result", ResultSchema);
