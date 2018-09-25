const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);
const ChatSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    fromUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    messages: [messageSchema],
    file: { type: String, default: "" }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
