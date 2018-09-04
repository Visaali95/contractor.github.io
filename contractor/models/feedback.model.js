const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    ratings: {
      type: Number,
      enum: [1, 2, 3, 4, 5]
    },
    desc: String
  },
  { timestamps: true }
);

const feedback = mongoose.model("feedback", feedbackSchema);
module.exports = feedback;
