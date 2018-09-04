const mongoose = require("mongoose");
const supportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    emailId: String,
    ques: String
  },
  { timestamps: true }
);

const support = mongoose.model("support", supportSchema);
module.exports = support;
