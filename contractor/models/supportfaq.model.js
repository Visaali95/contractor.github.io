const mongoose = require("mongoose");

const supportFAQSchema = new mongoose.Schema(
  {
    ques: { type: String, default: "" },
    ans: { type: String, default: "" }
  },
  { versionKey: false }
);

const supportFAQ = mongoose.model("supportFAQ", supportFAQSchema);
module.exports = supportFAQ;
