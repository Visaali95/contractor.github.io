const bid = require("../models/bid.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const bidCreate = (req, res) => {
  var bidSave = new bid(req.body);
  bidSave
    .save()
    .then(offer => {
      return ReS(res, { message: "Updated Successfully", offer: offer });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.bidCreate = bidCreate;
