const mongoose = require("mongoose");

const jobTradeSchema = new mongoose.Schema(
  {
    jobTrade: { type: String, default: "" }
  },
  { versionKey: false }
);

const jobTrade = mongoose.model("jobTrade", jobTradeSchema);
module.exports = jobTrade;
