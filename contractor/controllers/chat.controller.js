const Chat = require("../models/chat.model");
const { ReE, ReS } = require("../services/util.service");
const User = require("../models/user.model");
const _ = require("lodash");
const pushNotification = require("../controllers/pushIosNotification.controller");
const androidNotification = require("../controllers/pushAndroidNotification.controller");
const ChatCreate = (req, res) => {
  Chat.findOneAndUpdate(
    { conversationId: req.params.conversationId },
    {
      $push: { messages: { message: req.body.message } }
    },
    {
      new: true
    }
  )
    .then(chats => {
      return User.findOne({ _id: req.body.toUserId }).then(receiver => {
        return User.findOne({ _id: req.body.fromUserId }).then(sender => {
          let msg = `${sender.first} has sent you a message`;
          pushNotification.iosPush(receiver.deviceToken, {
            message: msg
          });
          androidNotification.androidPush(receiver.deviceToken, {
            message: msg
          });
          return ReS(res, {
            message: "Updated Successfully",
            chats: chats
          });
        });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};

module.exports.ChatCreate = ChatCreate;
