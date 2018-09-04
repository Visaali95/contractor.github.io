const mongoose = require("mongoose");
const aboutUsSchema = new mongoose.Schema(
  {
    aboutUs: String
  },
  { timestamps: true }
);

const aboutUs = mongoose.model("aboutUs", aboutUsSchema);
module.exports = aboutUs;
