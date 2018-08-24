const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    comment: String,
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" }
  },

  { timestamps: true }
);

const comments = mongoose.model("comments", commentsSchema);
module.exports = comments;
