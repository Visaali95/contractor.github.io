const jobTrade = require("../models/jobtrade.model");
const jobWork = require("../models/jobwork.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const create = (req, res) => {
  var jobTradeSave = new jobTrade(req.body);
  jobTradeSave
    .save()
    .then(jobtrade => {
      return ReS(res, { message: "Updated Successfully", jobtrade: jobtrade });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.create = create;
const fetch = (req, res) => {
  var dropdownValues = {};

  return jobTrade
    .find({})
    .then(jobTrade => {
      dropdownValues.jobTrade = jobTrade;
      return jobWork.find({}).then(jobWork => {
        dropdownValues.jobWork = jobWork;

        // if (dropdownValues.jobTrade.length == 0) {

        //   throw "Error 1";
        // } else if (dropdownValues.jobWork == 0) {

        //   throw "Error 2";
        // }
        return ReS(res, {
          message: "DropDown details",
          dropdownValues: dropdownValues
        });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.fetch = fetch;

const createWork = (req, res) => {
  var jobWorkSave = new jobWork(req.body);
  jobWorkSave
    .save()
    .then(jobwork => {
      return ReS(res, { message: "Updated Successfully", jobwork: jobwork });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.createWork = createWork;
