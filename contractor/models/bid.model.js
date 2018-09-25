const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    lineItemId: { type: String, default: "" },
    price: { type: Number, default: "" }
  },
  { timestamps: true }
);

const bid = mongoose.model("bid", bidSchema);
module.exports = bid;
