const Jobs = require("../models/job.model");
const makeOffer = require("../models/makeoffer.model");
const assignJobs = require("../models/assignjobs.model");
const bid = require("../models/bid.model");
const User = require("../models/user.model");
const company = require("../models/company.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
const moment = require("moment");
// job create or post job
const create = (req, res) => {
  req.body.geo = [req.body.latitude, req.body.longitude];
  req.body.jobStatus = "posted";
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
// lineItem create or line Item update
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
// room create or room update
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
// job draft
const draftjob = (req, res) => {
  // let drafts = [];
  Jobs.find({
    user_id: req.params.user_id,
    $or: [{ addRoom: { $size: 0 } }, { lineHeight: { $size: 0 } }]
  })
    .sort({ createdAt: -1 })
    .then(draft => {
      if (draft.length == 0) {
        throw "Draft not found";
      }
      // draft.map(draftObj => {
      //   drafts.push(pickResponse(draftObj));
      // });

      return ReS(res, { message: "Draft details", draft: draft });
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
// get job details
const jobDetails = (req, res) => {
  Jobs.find({ _id: req.params.job_id })
    .sort({ createdAt: -1 })
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
// edit job or update job
const editTask = (req, res) => {
  Jobs.findOneAndUpdate(
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
// edit rooms or update rooms
const editRoom = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: { addRoom: req.body.addRoom }
    },
    {
      upsert: true,
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
module.exports.editRoom = editRoom;
// edit lineHeight or update lineHeight
const editLineHeight = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: { lineHeight: req.body.lineHeight }
    },
    {
      upseert: true,
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
module.exports.editLineHeight = editLineHeight;
//  dashboard
const DashboardDetails = (req, res) => {
  var dashboard;

  // posts section
  return Jobs.find({ user_id: req.params.user_id })
    .sort({ createdAt: -1 })
    .then(result => {
      dashboard = {
        post: result,
        inactive: []
      };
      // company info section
      return company
        .find({ user: req.params.user_id })
        .sort({ createdAt: -1 })
        .then(company => {
          dashboard.company = company;
          // inactive section
          result.map(exp => {
            if (moment(exp.postExpiry).isSameOrBefore(new Date())) {
              dashboard.inactive.push(exp);
            }
          });
          // jobs section
          return Jobs.find({
            user_id: { $ne: req.params.user_id },
            jobStatus: { $ne: "complete" }
          })
            .sort({ createdAt: -1 })
            .then(jobs => {
              return makeOffer
                .find({
                  $or: [
                    { jobId: { $ne: req.params.jobId } },
                    { lineItemId: { $ne: req.params.jobId } }
                  ]
                })
                .then(mojobs => {
                  return bid
                    .find({
                      $or: [
                        { jobId: { $ne: req.params.jobId } },
                        { lineItemId: { $ne: req.params.jobId } }
                      ]
                    })
                    .then(bjobs => {
                      dashboard.jobs = jobs;

                      // contracts section
                      return Jobs.find({
                        user_id: req.params.user_id,
                        jobStatus: { $ne: "completed" }
                      })
                        .sort({ createdAt: -1 })
                        .then(contracts => {
                          return assignJobs
                            .find({
                              $or: [
                                { jobId: req.params.jobId },
                                { lineItemId: req.params.jobId }
                              ]
                            })
                            .then(jobs => {
                              dashboard.contracts = contracts;
                              // complete posts section
                              return Jobs.find({
                                user_id: req.params.user_id,
                                jobStatus: "completed"
                              }).then(completePosts => {
                                dashboard.completePosts = completePosts;
                                // complete contracts section
                                return Jobs.find({
                                  user_id: { $ne: req.params.user_id },
                                  jobStatus: "completed"
                                }).then(completeContracts => {
                                  dashboard.completeContracts = completeContracts;
                                  return ReS(res, {
                                    message: "Dashboard details",
                                    dashboard: dashboard
                                  });
                                });
                              });
                            });
                        });
                    });
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

// search job by jobTitle
const searchJobTitle = (req, res) => {
  Jobs.find({
    jobTitle: { $regex: req.query.q, $options: "i" },
    user_id: { $ne: req.params.user_id }
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .then(result => {
      if (result.length == 0) {
        throw "Jobs not found";
      }
      return ReS(res, { message: "Updated Successfully", result: result });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.searchJobTitle = searchJobTitle;
// search job by filter
const searchFilter = (req, res) => {
  let geoArr, query, geo, or, jobLoc, user;

  or = [
    { user_id: { $ne: req.params.user_id } }, //not to show my jobs on my search
    { "lineHeight.jobTrade": req.body.jobTrade },
    { isInterior: req.body.isInterior },
    { "addRoom.details": req.body.details }
  ];

  user = { $ne: req.params.user_id };
  jobLoc = {
    $regex: req.body.jobLocation,
    $options: "i"
  };

  if (!req.body.latitude && !req.body.longitude && !req.body.jobLocation) {
    query = { $or: or, user };
  } else if (req.body.jobLocation) {
    query = { $or: or, user_id: user, jobLocation: jobLoc };
  } else {
    geoArr = [req.body.latitude, req.body.longitude];

    query = {
      geo: {
        $near: geoArr,
        $maxDistance: 1000
      },
      $or: or,
      user_id: user
    };
  }

  Jobs.find(query)
    .sort({ createdAt: -1 })

    .then(result => {
      if (result.length == 0) {
        throw "Jobs not found";
      }
      return ReS(res, { message: "Updated Successfully", result: result });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.searchFilter = searchFilter;
//  job completed
const jobCompleted = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { jobStatus: "completed" } },
    { upsert: true, new: true }
  )
    .then(result => {
      if (result.length == 0) {
        throw "Jobs not found";
      }
      return ReS(res, { message: "Updated Successfully", result: result });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.jobCompleted = jobCompleted;
