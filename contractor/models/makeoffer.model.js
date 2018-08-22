const mongoose = require("mongoose");
const makeofferSchema = new mongoose.Schema({
  fromUserId: String,
  toUserId: String,
  jobId: String,
  lineItemId: String
});

const makeOffer = mongoose.model("makeOffer", makeofferSchema);
module.exports = makeOffer;
