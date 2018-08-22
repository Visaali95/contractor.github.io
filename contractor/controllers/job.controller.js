const Jobs = require("../models/job.model");
const User = require("../models/user.model");
const company = require("../models/company.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
const moment = require("moment");

const create = (req, res) => {
  var JobSave = new Jobs(req.body);
  JobSave.save()
    .then(jobs => {
      return ReS(res, { message: "Updated Successfully", jobs: jobs._id });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.create = create;

const updatelineheights = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: { lineHeight: req.body.lineHeight }
    },
    {
      new: true
    }
  )
    .then(lineHeight => {
      return ReS(res, {
        message: "Updated Successfully",
        lineHeight: lineHeight.lineHeight
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.updatelineheights = updatelineheights;

const updaterooms = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: { addRoom: req.body.addRoom }
    },
    {
      new: true
    }
  )
    .then(rooms => {
      return ReS(res, {
        message: "Updated Successfully",
        rooms: rooms.addRoom
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.updaterooms = updaterooms;

const draftjob = (req, res) => {
  let drafts = [];
  Jobs.find({
    user_id: req.params.user_id,
    $or: [{ addRoom: { $size: 0 } }, { lineHeight: { $size: 0 } }]
  })
    .then(draft => {
      if (draft.length == 0) {
        throw "Draft not found";
      }
      draft.map(draftObj => {
        drafts.push(pickResponse(draftObj));
      });

      return ReS(res, { message: "Draft details", draft: drafts });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.draftjob = draftjob;

let pickResponse = data => {
  data = _.pick(data, ["_id", "jobTitle", "jobLocation", "propertyType"]);
  return data;
};

const jobDetails = (req, res) => {
  Jobs.find({ _id: req.params.job_id })
    .then(details => {
      if (!details) {
        throw "Job not found";
      }

      return ReS(res, { message: "Draft details", details: details });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.jobDetails = jobDetails;

const DashboardDetails = (req, res) => {
  var dashboard;
  return Jobs.find({ user_id: req.params.user_id })
    .then(result => {
      dashboard = {
        contracts: [],
        post: result,
        complete: [],
        inactive: []
      };
      result.map(exp => {
        if (!moment(exp.postExpiry).isSameOrBefore(new Date())) {
          dashboard.inactive.push(exp);
        }
      });
      return Jobs.find({ user_id: { $ne: req.params.user_id } }).then(jobs => {
        dashboard.jobs = jobs;
        return company.find({ user: req.params.user_id }).then(company => {
          dashboard.company = company;
          return ReS(res, {
            message: "Dashboard details",
            dashboard: dashboard
          });
        });
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};

module.exports.DashboardDetails = DashboardDetails;

let pickResult = result => {
  result = _.pick(result, [
    "jobTitle",
    "jobLocation",
    "propertyType",
    "postExpiry",
    "lineHeight",
    "user_id.first",
    "user_id.phone"
  ]);
  return result;
};

const editTask = (req, res) => {
  Jobs.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body
    },
    {
      new: true
    }
  )
    .then(task => {
      return ReS(res, { message: "Updated Successfully", task: task });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.editTask = editTask;

const searchJobTitle = (req, res) => {
  let results = [];
  Jobs.find({ jobTitle: { $regex: req.query.q, $options: "i" } })
    .sort({ created_at: -1 })
    .limit(20)
    .then(result => {
      if (result.length == 0) {
        throw "Jobs not found";
      }
      result.map(resultObj => {
        results.push(pickResponse(resultObj));
      });
      return ReS(res, { message: "Updated Successfully", result: results });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.searchJobTitle = searchJobTitle;
