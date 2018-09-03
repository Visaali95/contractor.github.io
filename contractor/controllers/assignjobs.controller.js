const assignJobs = require("../models/assignjobs.model");
const Jobs = require("../models/job.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const assignJobsCreate = (req, res) => {
  // req.body.jobStatus = "ongoing";
  var assignJobsSave = new assignJobs(req.body);
  assignJobsSave
    .save()
    .then(offer => {
      return Jobs.findOneAndUpdate(
        { _id: req.body.jobId },
        { $set: { jobStatus: "ongoing" } },
        { upsert: true, new: true }
      ).then(result => {
        return ReS(res, { message: "Updated Successfully", offer: offer });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.assignJobsCreate = assignJobsCreate;
