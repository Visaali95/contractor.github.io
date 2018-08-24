const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    lineItemId: String,
    price: Number
  },
  { timestamps: true }
);

const bid = mongoose.model("bid", bidSchema);
module.exports = bid;
