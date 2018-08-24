const comments = require("../models/comments.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const commentCreate = (req, res) => {
  var commentSave = new comments(req.body);
  commentSave
    .save()
    .then(comments => {
      return ReS(res, { message: "Updated Successfully", comments: comments });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.commentCreate = commentCreate;

const commentGet = (req, res) => {
  comments
    .find({ jobId: req.params.jobId })
    .sort({ createdAt: -1 })
    .populate("user")
    .then(comments => {
      return ReS(res, { message: "Updated Successfully", comments: comments });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.commentGet = commentGet;
