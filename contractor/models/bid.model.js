const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema({
  fromUserId: String,
  toUserId: String,
  jobId: String,
  lineItemId: String,
  price: Number
});

const bid = mongoose.model("bid", bidSchema);
module.exports = bid;
