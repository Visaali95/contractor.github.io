const aboutus = require("../models/aboutus.model");
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
  { name: "about", maxCount: 1 }
]);
const aboutUsCreate = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let err, company;

  upload(req, res, function(err) {
    var aboutUs_info = req.body;

    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var aboutUs = [];
      var about = req.files.about;
      if (Array.isArray(about)) {
        for (var val of about) {
          aboutUs.push("http://18.222.231.171:8081/" + val.filename);
        }
        aboutUs_info.aboutUs = aboutUs;
      } else {
        aboutUs_info.aboutUs = req.files.about[0].filename;
      }
    }
    aboutus
      .create(aboutUs_info)
      .then(aboutUs => {
        return ReS(res, { message: "Updated Successfully", aboutUs: aboutUs });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  });
};
module.exports.aboutUsCreate = aboutUsCreate;
