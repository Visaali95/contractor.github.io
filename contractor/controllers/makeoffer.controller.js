const makeOffer = require("../models/makeoffer.model");
const Jobs = require("../models/job.model");
const notification = require("../models/notification.model");
const { ReE, ReS } = require("../services/util.service");
const pushNotification = require("../controllers/pushIosNotification.controller");
const _ = require("lodash");
const User = require("../models/user.model");
const makeOfferCreate = (req, res) => {
  var makeOfferSave = new makeOffer(req.body);
  makeOfferSave
    .save()
    .then(offer => {
      return User.findOne({ _id: req.body.toUserId }).then(receiver => {
        let msg = `${user.first} is interested in working with you`;
        pushNotification.iosPush(user.deviceToken, {
          message: msg
        });
        var notificationSave = new notification({
          messages: msg,
          toUserId: receiver._id,
          jobUserId: offer.jobId
        });
        notificationSave.save();
        return ReS(res, { message: "Updated Successfully", offer: offer });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.makeOfferCreate = makeOfferCreate;

const makeOfferGet = (req, res) => {
  makeOffer
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
module.exports.makeOfferGet = makeOfferGet;

const notificationGet = (req, res) => {
  notification
    .find({ toUserId: req.params.toUserId })
    .sort({ createdAt: -1 })
    .populate("toUserId")
    .populate("jobUserId")
    .then(notifications => {
      return ReS(res, {
        message: "Updated Successfully",
        notifications: notifications
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.notificationGet = notificationGet;
