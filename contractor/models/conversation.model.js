const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.ObjectId, ref: "User" },
    senderName: String,
    receiverId: { type: mongoose.Schema.ObjectId, ref: "User" },
    message: String
  },
  { timestamps: true, versionKey: false }
);
const ConversationSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    messages: [messageSchema],
    files: String
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
