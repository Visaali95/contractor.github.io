const bid = require("../models/bid.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const bidCreate = (req, res) => {
  var bidSave = new bid(req.body);
  bidSave
    .save()
    .then(offer => {
      return User.findOne({ _id: req.body.toUserId }).then(user => {
        let msg = `${user.first} is interested in working with you`;
        pushNotification.iosPush(user.deviceToken, {
          message: msg
        });
        var notificationSave = new notification({
          messages: msg,
          toUserId: user._id
        });
        notificationSave.save();
        return ReS(res, { message: "Updated Successfully", offer: offer });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.bidCreate = bidCreate;
