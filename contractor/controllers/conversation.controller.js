const Conversation = require("../models/conversation.model");
const { ReE, ReS } = require("../services/util.service");
const User = require("../models/user.model");
const _ = require("lodash");
const pushNotification = require("../controllers/pushIosNotification.controller");
const androidNotification = require("../controllers/pushAndroidNotification.controller");
const ConversationCreate = (req, res) => {
  Conversation.findOneAndUpdate(
    {
      fromUserId: { $in: [req.body.fromUserId, req.body.toUserId] },
      toUserId: { $in: [req.body.fromUserId, req.body.toUserId] }
    },
    {
      $set: {
        fromUserId: req.body.fromUserId,
        toUserId: req.body.toUserId
      },
      $push: {
        messages: {
          message: req.body.message,
          senderId: req.body.senderId,
          senderName: req.body.senderName,
          receiverId: req.body.receiverId
        }
      }
    },
    {
      upsert: true,
      new: true
    }
  )
    .then(chats => {
      return User.findOne({ _id: req.body.toUserId }).then(receiver => {
        return User.findOne({ _id: req.body.fromUserId }).then(sender => {
          pushNotification.iosPush(receiver.deviceToken, {
            conversationId: chats._id,
            message: `${sender.first} has sent you a message`,
            msg: req.body.message,
            time: chats.updatedAt,
            receiverId: receiver._id,
            senderId: sender._id,
            senderName: sender.first,
            receiverName: receiver.first,
            senderImg: "",
            receiverImg: ""
          });
          androidNotification.androidPush(receiver.deviceToken, {
            conversationId: chats._id,
            message: `${sender.first} has sent you a message`,
            msg: req.body.message,
            time: chats.updatedAt,
            receiverId: receiver._id,
            senderId: sender._id,
            senderName: sender.first,
            receiverName: receiver.first,
            senderImg: "",
            receiverImg: ""
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

module.exports.ConversationCreate = ConversationCreate;

const ConversationGet = (req, res) => {
  Conversation.find({
    $or: [
      { toUserId: req.params.toUserId },
      { fromUserId: req.params.toUserId }
    ]
  })
    .sort({ updatedAt: -1 })
    .populate("fromUserId toUserId ")
    .then(Conversation => {
      Conversation.map(convo => {
        convo.messages = convo.messages[convo.messages.length - 1];
      });
      return ReS(res, {
        message: "Updated Successfully",
        Conversation: Conversation
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.ConversationGet = ConversationGet;

const MessagesGet = (req, res) => {
  Conversation.find({
    fromUserId: { $in: [req.query.fromUserId, req.query.toUserId] },
    toUserId: { $in: [req.query.fromUserId, req.query.toUserId] }
  })
    .sort({ createdAt: -1 })
    .populate("fromUserId toUserId ")
    .then(messages => {
      if (messages.length == 0) {
        return Conversation.findOneAndUpdate(
          {
            fromUserId: { $in: [req.query.fromUserId, req.query.toUserId] },
            toUserId: { $in: [req.query.fromUserId, req.query.toUserId] }
          },
          {
            $set: {
              fromUserId: req.query.fromUserId,
              toUserId: req.query.toUserId
            }
          },
          {
            upsert: true,
            new: true
          }
        ).then(messages => {
          return ReS(res, {
            message: "no messages yet to display",
            messages: messages
          });
        });
      } else
        return ReS(res, {
          message: "Updated Successfully",
          messages: messages
        });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.MessagesGet = MessagesGet;
