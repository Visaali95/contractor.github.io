const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    jobUserId: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
    messages: { type: String, default: "" }
  },
  { timestamps: true }
);

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;
