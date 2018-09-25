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

module.exports.updateTrade = (req, res) => {
  jobTrade
    .findByIdAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { upsert: true, new: true }
    )
    .then(jobtrade => {
      return ReS(res, {
        message: "jobTrade updated successfully",
        jobtrade: jobtrade
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.updateWork = (req, res) => {
  jobWork
    .findByIdAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { upsert: true, new: true }
    )
    .then(jobWork => {
      return ReS(res, {
        message: "jobWork updated successfully",
        jobWork: jobWork
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.deleteTrade = (req, res) => {
  jobTrade
    .findByIdAndRemove({ _id: req.body._id })
    .then(jobTrade => {
      if (!jobTrade) {
        throw "id doesnt exist to delete";
      }

      return ReS(res, {
        message: "jobTrade is removed successfully",
        jobTrade: jobTrade
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};

module.exports.deleteWork = (req, res) => {
  jobWork
    .findByIdAndRemove({ _id: req.body._id })
    .then(jobWork => {
      if (!jobWork) {
        throw "id doesnt exist to delete";
      }
      return ReS(res, {
        message: "jobWork is removed successfully",
        jobWork: jobWork
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
