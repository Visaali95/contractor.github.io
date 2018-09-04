const feedback = require("../models/feedback.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const feedbackCreate = (req, res) => {
  var feedbackSave = new feedback(req.body);
  feedbackSave
    .save()
    .then(feedback => {
      return ReS(res, { message: "Updated Successfully", feedback: feedback });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.feedbackCreate = feedbackCreate;
