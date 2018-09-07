const bid = require("../models/bid.model");
const User = require("../models/user.model");
const notification = require("../models/notification.model");
const pushNotification = require("../controllers/pushIosNotification.controller");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
const androidNotification = require("../controllers/pushAndroidNotification.controller");

const bidCreate = (req, res) => {
  var bidSave = new bid(req.body);
  bidSave
    .save()
    .then(offer => {
      return User.findOne({ _id: req.body.toUserId }).then(receiver => {
        return User.findOne({ _id: req.body.fromUserId }).then(sender => {
          let msg = `${sender.first} is interested in working with you`;
          pushNotification.iosPush(receiver.deviceToken, {
            message: msg
          });
          androidNotification.androidPush(receiver.deviceToken, {
            message: msg
          });
          var notificationSave = new notification({
            messages: msg,
            toUserId: receiver._id
          });
          notificationSave.save();
          return ReS(res, { message: "Updated Successfully", offer: offer });
        });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.bidCreate = bidCreate;

const bidGet = (req, res) => {
  bid
    .find({
      $or: [{ jobId: req.params.jobId }, { lineItemId: req.params.jobId }]
    })
    .sort({ createdAt: -1 })
    .populate("fromUserId toUserId")
    .then(offers => {
      return ReS(res, { message: "Updated Successfully", offers: offers });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.bidGet = bidGet;
