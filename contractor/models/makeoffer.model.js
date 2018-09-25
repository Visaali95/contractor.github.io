const mongoose = require("mongoose");
const makeofferSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    lineItemId: { type: String, default: "" }
    // price: { type: String, default: "" }
  },
  { timestamps: true }
);

const makeOffer = mongoose.model("makeOffer", makeofferSchema);
module.exports = makeOffer;
