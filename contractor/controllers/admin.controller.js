// const { User } = require("../models");
const User = require("../models/user.model");
const company = require("../models/company.model");
const assignJobs = require("../models/assignjobs.model");
const Jobs = require("../models/job.model");
const authService = require("../services/auth.service");
const { to, ReE, ReS } = require("../services/util.service");
const multer = require("multer");
const _ = require("lodash");

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
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
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
var upload = multer({ storage: storage }).fields([
  { name: "img", maxCount: 1 }
]);

const create = async function(req, res) {
  upload(req, res, async function(err) {
    res.setHeader("Content-Type", "application/json");

    const body = req.body;

    console.log(req.body);
    console.log(req.files);
    if (err) {
      return ReE(res, err, 422);
    }

    if (
      !body.email &&
      !body.phone &&
      body.fbid &&
      body.twitterid &&
      body.pintrestid &&
      body.instaid
    ) {
      return ReE(
        res,
        "Please enter an email or phone number or social media to register."
      );
    } else if (
      (body.email || body.phone) &&
      !body.password &&
      !(body.fbid || body.instaid || body.twitterid || body.pintrestid)
    ) {
      return ReE(res, "Please enter a password to register.");
    } else if (
      (body.email || body.phone) &&
      !body.postcode &&
      !(body.fbid || body.instaid || body.twitterid || body.pintrestid)
    ) {
      return ReE(res, "Please enter a postcode");
    } else {
      let err, user;
      if (body.userRole == "Admin") {
        [err, user] = await to(authService.createUser(body));

        if (err) return ReE(res, err, 422);
        return ReS(
          res,
          {
            message: "Successfully created new admin.",
            user: user.toWeb(),
            token: user.getJWT()
          },
          201
        );
      } else {
        return ReE(
          res,
          { message: "the user u have created is not an admin " },
          422
        );
      }
    }
  });
};
module.exports.create = create;

const get = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  let user = req.user;

  return ReS(res, { user: user.toWeb() });
};
module.exports.get = get;
// get all users
const getAll = function(req, res) {
  res.setHeader("Content-Type", "application/json");
  var perPage = 10,
    page = Math.max(0, req.query.page),
    admins = [];
  User.find({ userRole: "Admin" })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .then(allAdmins => {
      allAdmins.map(admin => {
        admins.push(omitResponse(admin));
      });
      return ReS(res, { allAdmins: admins });
    })
    .catch(err => {
      return ReE(res, err, 404);
    });
};
module.exports.getAll = getAll;

const update = async function(req, res) {
  let err, user, data;
  user = req.user;
  data = req.body;
  user.set(data);

  User.findById(user._id, function(err, user) {
    if (err) return ReE(res, err);
    else if (user) {
      if (data.email) {
        User.findOne({ email: data.email, id: { $ne: user._id } }, function(
          err,
          user
        ) {
          if (err) return ReE(res, err);
          if (user) return ReE(res, "email id already exits");
        });
      } else if (data.fbid) {
        User.findOne({ fbid: data.fbid, id: { $ne: user._id } }, function(
          err,
          user
        ) {
          if (err) return ReE(res, err);
          if (user) return ReE(res, "FBid id already exits");
        });
      } else if (data.phone) {
        User.findOne({ phone: data.phone, id: { $ne: user._id } }, function(
          err,
          user
        ) {
          if (err) return ReE(res, err);
          if (user) return ReE(res, "Phone number already exits");
        });
      } else {
        if (req.body.userType) {
          req.body.isSignUpProfile = true;
        }
        User.findByIdAndUpdate(user._id, { $set: req.body }, function(
          err,
          result
        ) {
          if (err) {
            return ReE(res, err);
          }

          // console.log("RESULT: " + result);
          return ReS(res, { message: "Updated Successfully" });
        });
      }
    } else {
      return ReE(res, "Invalid user token");
    }
  });
};
module.exports.update = update;

const remove = async function(req, res) {
  let user, err;
  user = req.user;
  if (!user.userRole == "Super Admin") {
    [err, user] = await to(user.destroy());
    if (err) return ReE(res, "error occured trying to delete user");

    return ReS(res, { message: "Deleted User" }, 204);
  } else {
    return ReE(res, "Super Admin can't be deleted");
  }
};
module.exports.remove = remove;

let omitResponse = data => {
  data = JSON.parse(JSON.stringify(data));

  data = _.omit(data, ["password", "otp"]);

  return data;
};

// admin login

const login = async function(req, res) {
  const body = req.body;
  let err, user;
  //return ReS(res, {token:body});

  [err, user] = await to(authService.authUser(req.body));
  if (err) return ReE(res, err, 422);
  if (user.userRole == "Super Admin" || user.userRole == "Admin") {
    return ReS(res, { token: user.getJWT(), user: pickResponse(user) });
  }
};
module.exports.login = login;

let pickResponse = data => {
  data = _.pick(data, ["_id", "email", "phone", "first", "userRole"]);
  return data;
};
// dashboard admin panel

const adminDashboard = (req, res) => {
  let dashboard;
  User.find({ userRole: "User" })
    .then(users => {
      dashboard = {
        users: users.length
      };
      return User.find({ userRole: "Admin" }).then(admin => {
        dashboard.admin = admin.length;
        return Jobs.find({}).then(jobs => {
          dashboard.jobs = jobs.length;
          return company.find({}).then(company => {
            dashboard.company = company.length;
            return assignJobs.find({}).then(contracts => {
              dashboard.contracts = contracts.length;

              return ReS(res, {
                message: "Admin Panel Details",
                dashboard: dashboard
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
module.exports.adminDashboard = adminDashboard;

module.exports.adminUserList = (req, res) => {
  User.find({ userRole: "User" })
    .then(userList => {
      return ReS(res, { message: "List of all users", userList: userList });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.adminJobList = (req, res) => {
  Jobs.find({})
    .then(jobList => {
      return ReS(res, { message: "List of all jobs", jobList: jobList });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.adminCompanyList = (req, res) => {
  company
    .find({})
    .then(companyList => {
      return ReS(res, {
        message: "List of all companies",
        companyList: companyList
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.adminContractList = (req, res) => {
  assignJobs
    .find({})
    .then(contractList => {
      return ReS(res, {
        message: "List of all contracts",
        contractList: contractList
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.adminJobStatus = (req, res) => {
  Jobs.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { jobStatus: req.body.jobStatus } },
    { upsert: true, new: true }
  )
    .then(jobStatus => {
      return ReS(res, {
        message: "jobStatus updated successfully",
        jobStatus: jobStatus
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.adminUserStatus = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { status: req.body.status } },
    { upsert: true, new: true }
  )
    .then(userStatus => {
      return ReS(res, {
        message: "userStatus updated successfully",
        userStatus: userStatus
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
