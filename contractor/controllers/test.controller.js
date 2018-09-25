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

// lineItem create or line Item update
const updatelineheights = (req, res) => {
  let arr = [];

  for (var i = 0; i < 100; i++) {
    arr.push({ name: `photos${i}`, maxCount: 10 });
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
          lineHeight: lineHeightRequest
        }
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
  });
};
module.exports.updatelineheights = updatelineheights;
