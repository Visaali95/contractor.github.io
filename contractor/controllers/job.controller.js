const Jobs = require("../models/job.model");
const makeOffer = require("../models/makeoffer.model");
const assignJobs = require("../models/assignjobs.model");
const bid = require("../models/bid.model");
const User = require("../models/user.model");
const company = require("../models/company.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
const moment = require("moment");
const multer = require("multer");
var photos;
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(
    //   null,
    //   "/home/parangat-pt-01/Documents/ParangatTechnologies/contractor_api/public/images/uploads"
    // );
    cb(null, "/home/ubuntu/api/public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.floor(Math.random() * 90000) +
        10000 +
        "." +
        file.mimetype.split("/")[1]
    );
  },
  fileFilter: function(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb("Only images are allowed", false);
    }
    cb(null, true);
  }
});
// job create or post job
const create = (req, res) => {
  req.body.geo = [req.body.latitude, req.body.longitude];
  // req.body.jobStatus = "posted";
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
  let arr = [];

  for (var i = 0; i < 1000; i++) {
    arr.push({ name: `photos${i}`, maxCount: 1000 });
  }
  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1073741824
    }
  }).fields(arr);

  upload(req, res, function(err) {
    let lineHeightRequest = JSON.parse(req.body.lineHeight);
    console.log(req.body);
    console.log(req.files);

    if (err) {
      return ReE(res, err, 422);
    }
    lineHeightRequest.map((lh, i) => {
      photos = req.files[`photos${i}`];
      let lineItemPics = [];
      if (photos == undefined) {
        lineItemPics = [];
      } else
        photos.map(photo => {
          lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
        });
      lh.lineItemPics = lineItemPics;
      // lineHeightRequest = lh.lineItemPics;
    });
    Jobs.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          lineHeight: lineHeightRequest,
          jobStatus: "posted"
        }
      },
      {
        new: true
      }
    )
      .then(jobs => {
        if (jobs.isPostAs == 1) {
          let sum = 0;
          jobs.lineHeight.map(lh => {
            lh.fixedCost = lh.fixedCost || 0;
            lh.hourlyTotal = lh.hourlyTotal || 0;
            sum = sum + lh.fixedCost + lh.hourlyTotal;
          });
          return Jobs.findOneAndUpdate(
            { _id: req.params._id },
            { $set: { jobCost: sum } },
            { upsert: true, new: true }
          ).then(job => {
            return ReS(res, {
              message: "Updated Successfully",
              lineHeight: job.lineHeight
            });
          });
        }
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
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
        return ReS(res, { message: "Drafts not found", draft: draft });
      }
      // draft.map(draftObj => {
      //   drafts.push(pickResponse(draftObj));
      // });
      else return ReS(res, { message: "Draft details", draft: draft });
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
  let arr = [];
  let lineItemPics = [];
  let setObj;

  for (var i = 0; i < 1000; i++) {
    arr.push({ name: `photos${i}`, maxCount: 10 });
  }
  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1073741824
    }
  }).fields(arr);

  upload(req, res, function(err) {
    req.body.lineHeight = JSON.parse(req.body.lineHeight);
    console.log(req.body);
    console.log(req.files);

    if (err) {
      return ReE(res, err, 422);
    }
    req.body.lineHeight.map((lh, i) => {
      lh.lineItemPics = [];
      photos = req.files[`photos${i}`];
      if (photos != undefined) {
        photos.map(photo => {
          lh.lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
          //lh.lineItemPics = lh.lineItemPics.concat(lineItemPics);
        });

        // lh.lineItemPics = lineItemPics;
        // lineHeightRequest = lh.lineItemPics;
      } else {
        lh.lineItemPics = [];
      }
    });
    Jobs.findOne({ _id: req.params._id })
      .then(jobs => {
        let temp = [];
        temp = jobs.lineHeight;
        jobs.lineHeight = req.body.lineHeight;
        jobs.lineHeight.map((lhh, i) => {
          if (temp[i] != undefined) {
            lhh.lineItemPics = temp[i].lineItemPics.concat(
              req.body.lineHeight[i].lineItemPics
            );
          }
          //else {
          // }
        });

        if (jobs.isPostAs == 1) {
          let sum = 0;
          jobs.lineHeight.map(lh => {
            lh.fixedCost = lh.fixedCost || 0;
            lh.hourlyTotal = lh.hourlyTotal || 0;
            sum = sum + lh.fixedCost + lh.hourlyTotal;
          });
          setObj = {
            jobCost: sum,
            lineHeight: jobs.lineHeight
          };
        } else {
          setObj = {
            lineHeight: jobs.lineHeight
          };
        }
        return Jobs.findOneAndUpdate(
          { _id: req.params._id },
          { $set: setObj },
          { upsert: true, new: true, multi: true }
        ).then(job => {
          return ReS(res, {
            message: "Updated Successfully",
            lineHeight: job.lineHeight
          });
        });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  });
};
module.exports.editLineHeight = editLineHeight;
//  dashboard
const DashboardDetails = (req, res) => {
  var dashboard;

  // posts section
  return Jobs.find({ user_id: req.params.user_id, jobStatus: "posted" })
    .sort({ createdAt: -1 })
    .populate("user_id")
    .then(result => {
      dashboard = {
        post: result,
        inactive: []
      };
      // company info section
      return company
        .find({ user: req.params.user_id })
        .sort({ createdAt: -1 })
        .populate("user")
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
            jobStatus: "posted"
          })
            .sort({ createdAt: -1 })
            .populate("user_id")
            .then(jobs => {
              dashboard.jobs = jobs;

              // contracts section
              return Jobs.find({
                //  user_id: req.params.user_id,
                jobStatus: "ongoing"
              })
                .populate("user_id")
                .sort({ createdAt: -1 })
                .then(contracts => {
                  let jobId = [],
                    lineItemId = [];
                  contracts.map(contract => {
                    jobId.push(contract.id);
                    if (contract.lineHeight) {
                      contract.lineHeight.map(lh => {
                        lineItemId.push(lh.id);
                      });
                    }
                  });
                  return assignJobs
                    .find({
                      $and: [
                        {
                          $or: [
                            { fromUserId: req.params.user_id },
                            { toUserId: req.params.user_id }
                          ]
                        },
                        {
                          $or: [
                            { jobId: { $in: jobId } },
                            { lineItemId: { $in: lineItemId } }
                          ]
                        }
                      ]
                    })
                    .populate("jobId toUserId fromUserId")
                    .then(ajobs => {
                      dashboard.contracts = ajobs;
                      return Jobs.find({
                        user_id: req.params.user_id,
                        jobStatus: "completed"
                      })
                        .populate("user_id")
                        .then(completePosts => {
                          dashboard.completePosts = completePosts;
                          // complete contracts section
                          return Jobs.find({
                            user_id: { $ne: req.params.user_id },
                            jobStatus: "completed"
                          }).then(completeContracts => {
                            let jobId = [],
                              lineItemId = [];
                            completeContracts.map(contract => {
                              jobId.push(contract.id);
                              jobId.push(contract.user_id);
                              if (contract.lineHeight) {
                                contract.lineHeight.map(lh => {
                                  lineItemId.push(lh.id);
                                });
                              }
                            });
                            return assignJobs
                              .find({
                                toUserId: req.params.user_id,
                                $or: [
                                  { jobId: { $in: jobId } },
                                  { lineItemId: { $in: lineItemId } }
                                ]
                              })
                              .populate("jobId fromUserId")
                              .then(cajobs => {
                                dashboard.completeContracts = cajobs;
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
  let typeSearch;
  let arr1 = [],
    arr2 = [];
  Jobs.find({
    jobTitle: { $regex: req.query.q, $options: "i" },
    user_id: { $ne: req.params.user_id }
  })
    .sort({ createdAt: -1 })
    .then(result1 => {
      result1.map(res1 => {
        res1.typeSearch = "job";
        res1._doc.typeSearch = "job";
        arr2.push(res1);
      });
      if (result1.length == 0) {
        throw "Jobs not found";
      }
      return User.find({
        first: { $regex: req.query.q, $options: "i" },
        _id: { $ne: req.params.user_id }
      }).then(result2 => {
        result2.map(res2 => {
          res2.typeSearch = "user";
          res2._doc.typeSearch = "user";
          arr2.push(res2);
        });
        if (result2.length == 0) {
          throw "user not found";
        }
        // var result = result1.concat(result2);
        var result = [...arr1, ...arr2];
        return ReS(res, { message: "Updated Successfully", result: result });
      });
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
