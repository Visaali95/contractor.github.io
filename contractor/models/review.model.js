const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    review: { type: String, default: "" },
    ratings: {
      type: Number,
      enum: [1, 2, 3, 4, 5]
    },
    reviewpics: { type: [String], default: [] }
  },
  { timestamps: true }
);

const review = mongoose.model("review", reviewSchema);
module.exports = review;
