const mongoose = require("mongoose");

const supportFAQSchema = new mongoose.Schema(
  {
    ques: String,
    ans: String
  },
  { versionKey: false }
);

const supportFAQ = mongoose.model("supportFAQ", supportFAQSchema);
module.exports = supportFAQ;
