const mongoose = require("mongoose");

const jobWorkSchema = new mongoose.Schema(
  {
    jobWork: String
  },
  { versionKey: false }
);

const jobWork = mongoose.model("jobWork", jobWorkSchema);
module.exports = jobWork;
