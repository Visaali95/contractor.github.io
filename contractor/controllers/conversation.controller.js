const Conversation = require("../models/conversation.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const ConversationCreate = (req, res) => {
  var ConversationSave = new Conversation(req.body);
  ConversationSave.save()
    .then(Conversations => {
      return ReS(res, {
        message: "Updated Successfully",
        Conversations: Conversations
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.ConversationCreate = ConversationCreate;

const ConversationGet = (req, res) => {
  Conversation.find({ fromUserId: req.params.fromUserId })
    .sort({ createdAt: -1 })
    .populate("fromUserId toUserId ")
    .then(Conversation => {
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
