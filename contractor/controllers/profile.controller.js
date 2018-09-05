const review = require("../models/review.model");
const User = require("../models/user.model");
const company = require("../models/company.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
const moment = require("moment");
var multer = require("multer");

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
//var upload = multer({storage: storage}).single('image');
//var upload = multer().array('photos',10);
var upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "photos", maxCount: 8 },
  { name: "license", maxCount: 1 }
]);

const profile = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  var profileDetails;

  upload(req, res, function(err) {
    let user = req.user;
    var company_info = req.body;
    company_info.user = user._id;
    console.log(req.body);
    console.log(req.files);
    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var companyLicense = [];
      var license = req.files.license;
      if (Array.isArray(license)) {
        for (var val of license) {
          companyLicense.push("http://18.222.231.171:8081/" + val.filename);
        }
        company_info.companyLicense = companyLicense;
      } else {
        company_info.companyLicense = req.files.license[0].filename;
      }
      return company
        .findByIdAndUpdate(
          { _id: req.params._id },
          {
            $set: {
              companyAbout: req.body.companyAbout,
              companySocial: req.body.companySocial,
              isLicense: req.body.isLicense,
              companyLicense: req.body.companyLicense[0]
            }
          },
          { upsert: true, new: true }
        )
        .sort({ createdAt: -1 })
        .then(result => {
          profileDetails = {
            galleryCompany: result.pictures,
            galleryReview: [],
            about: result
          };
          return review
            .findOne({ toUserId: result.user }) //send the logged in user id
            .then(galleryReview => {
              profileDetails.galleryReview = galleryReview.reviewpics;
              return ReS(res, {
                message: "profile details",
                profileDetails: profileDetails
              });
            });
        })
        .catch(e => {
          return ReE(res, e, 422);
        });
    }
  });
};
module.exports.profile = profile;

const profileGet = (req, res) => {
  var profileDetails;

  return company
    .findOne({ _id: req.params._id })
    .sort({ createdAt: -1 })
    .then(result => {
      profileDetails = {
        galleryCompany: result.pictures,
        galleryReview: [],
        about: result
      };
      return review
        .findOne({ toUserId: result.user }) //send the logged in user id
        .then(galleryReview => {
          profileDetails.galleryReview = galleryReview.reviewpics;
          return ReS(res, {
            message: "profile details",
            profileDetails: profileDetails
          });
        });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.profileGet = profileGet;
