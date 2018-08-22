const makeOffer = require("../models/makeoffer.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const makeOfferCreate = (req, res) => {
  var makeOfferSave = new makeOffer(req.body);
  makeOfferSave
    .save()
    .then(offer => {
      return ReS(res, { message: "Updated Successfully", offer: offer });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.makeOfferCreate = makeOfferCreate;
