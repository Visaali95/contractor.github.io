const assignJobs = require("../models/assignjobs.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const assignJobsCreate = (req, res) => {
  var assignJobsSave = new assignJobs(req.body);
  assignJobsSave
    .save()
    .then(offer => {
      return ReS(res, { message: "Updated Successfully", offer: offer });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.assignJobsCreate = assignJobsCreate;
