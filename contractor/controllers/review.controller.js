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
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1073741824
  }
}).fields([{ name: "pics", maxCount: 20 }]);
const reviewCreate = (req, res) => {
  //res.setHeader("Content-Type", "application/json");
  let err, company;

  upload(req, res, function(err) {
    var review_info = req.body;

    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var reviewpics = [];
      var pics = req.files.pics;
      if (pics == undefined) {
        review_info.reviewpics = [];
      } else
        pics.map(photo => {
          reviewpics.push("http://18.222.231.171:8081/" + photo.filename);
        });
      review_info.reviewpics = reviewpics;
    }

    review
      .create(review_info)
      .then(review => {
        return ReS(res, { message: "Updated Successfully", review: review });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  });
};
module.exports.reviewCreate = reviewCreate;

const reviewGet = (req, res) => {
  let rating = [],
    nofive = 0,
    nofour = 0,
    nothree = 0,
    notwo = 0,
    noone = 0,
    five = 0,
    four = 0,
    three = 0,
    two = 0,
    one = 0,
    ratingsPercentage = {};
  calcRatingPerc = reviews => {
    rating.map(rat => {
      if (rat == 5) {
        nofive = nofive + 1;
        five = Math.floor((nofive / reviews.length) * 100);
      } else if (rat == 4) {
        nofour = nofour + 1;
        four = Math.floor((nofour / reviews.length) * 100);
      } else if (rat == 3) {
        nothree = nothree + 1;
        three = Math.floor((nothree / reviews.length) * 100);
      } else if (rat == 2) {
        notwo = notwo + 1;
        two = Math.floor((notwo / reviews.length) * 100);
      } else if (rat == 1) {
        noone = noone + 1;
        one = Math.floor((noone / reviews.length) * 100);
      }
    });
  };
  review
    .find({ toUserId: req.params.toUserId })
    .sort({ createdAt: -1 })
    .populate("fromUserId toUserId")
    .then(reviews => {
      if (reviews.length == 0) {
        return ReS(res, {
          message: "no reviews ",
          ratingsPercentage: {
            five: five,
            four: four,
            three: three,
            two: two,
            one: one
          },
          reviews: reviews
        });
      } else {
        reviews.map(review => {
          rating.push(review.ratings);
        });

        calcRatingPerc(reviews);
        return ReS(res, {
          message: "Updated Successfully",
          ratingsPercentage: {
            five: five,
            four: four,
            three: three,
            two: two,
            one: one
          },
          reviews: reviews
        });
      }
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.reviewGet = reviewGet;
