const mongoose = require("mongoose");
const assignJobsSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    lineItemId: String
  },
  { timestamps: true }
);

const assignJobs = mongoose.model("assignJobs", assignJobsSchema);
module.exports = assignJobs;
