const mongoose = require("mongoose");

const jobTradeSchema = new mongoose.Schema(
  {
    jobTrade: String
  },
  { versionKey: false }
);

const jobTrade = mongoose.model("jobTrade", jobTradeSchema);
module.exports = jobTrade;
