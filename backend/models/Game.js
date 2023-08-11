const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  market_name: {
    type: String,
  },
  market_type: {
    type: String,
  },
  open_time: {
    type: String,
  },
  close_time: {
    type: String,
  },
  status: {
    type: String,
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

module.exports = mongoose.model("Game", schema);
