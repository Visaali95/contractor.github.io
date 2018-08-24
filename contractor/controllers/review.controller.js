const review = require("../models/review.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");
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
var upload = multer({ storage: storage }).fields([
  { name: "pics", maxCount: 20 }
]);
const reviewCreate = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let err, company;

  upload(req, res, function(err) {
    var review_info = req.body;

    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var reviewpics = [];
      var pics = req.files.pics;
      if (Array.isArray(pics)) {
        for (var val of pics) {
          reviewpics.push("http://18.222.231.171:8081/" + val.filename);
        }
        review_info.reviewpics = reviewpics;
      } else {
        review_info.reviewpics = req.files.pics[0].filename;
      }
    }
    review
      .create(review_info)
      .then(offer => {
        return ReS(res, { message: "Updated Successfully", review: review });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  });
};
module.exports.reviewCreate = reviewCreate;

const reviewGet = (req, res) => {
  review
    .find({ toUserId: req.params.toUserId })
    .sort({ createdAt: -1 })
    .populate("fromUserId toUserId")
    .then(reviews => {
      return ReS(res, { message: "Updated Successfully", reviews: reviews });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.reviewGet = reviewGet;
