const mongoose = require("mongoose");
const supportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    emailId: { type: String, default: "" },
    ques: { type: String, default: "" }
  },
  { timestamps: true }
);

const support = mongoose.model("support", supportSchema);
module.exports = support;
