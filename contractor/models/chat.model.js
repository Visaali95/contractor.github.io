const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: String
  },
  { timestamps: true, versionKey: false }
);
const ChatSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    messages: [messageSchema],
    file: String
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
