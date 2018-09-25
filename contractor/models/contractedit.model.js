const mongoose = require("mongoose");
const contractEditSchema = new mongoose.Schema(
  {
    contractInfo: { type: mongoose.Schema.ObjectId, ref: "assignJobs" },
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    reasonForEdit: { type: String, default: "" },
    newPrice: { type: Number, default: "" },
    picsJustifyingPrice: { type: [String] },
    isAccept: { type: Number, enum: [0, 1] } //0-reject , 1 - accept
  },
  { timestamps: true }
);

const contractEdit = mongoose.model("contractEdit", contractEditSchema);
module.exports = contractEdit;
