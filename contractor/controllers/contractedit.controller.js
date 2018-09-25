const assignJobs = require("../models/assignjobs.model");
const contractEdit = require("../models/contractedit.model");
const Jobs = require("../models/job.model");
const User = require("../models/user.model");
const { ReE, ReS } = require("../services/util.service");
const pushNotification = require("../controllers/pushIosNotification.controller");
const androidNotification = require("../controllers/pushAndroidNotification.controller");
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

module.exports.contractEditPost = (req, res) => {
  //res.setHeader("Content-Type", "application/json");
  upload(req, res, function(err) {
    var contractEdit_info = req.body;

    if (err) {
      return ReE(res, err, 422);
    }
    if (req.files) {
      var picsJustifyingPrice = [];
      var pics = req.files.pics;
      if (pics == undefined) {
        contractEdit_info.picsJustifyingPrice = [];
      } else
        pics.map(photo => {
          picsJustifyingPrice.push(
            "http://18.222.231.171:8081/" + photo.filename
          );
        });
      contractEdit_info.picsJustifyingPrice = picsJustifyingPrice;
    }

    var contractEditSave = new contractEdit(contractEdit_info);
    contractEditSave
      .save()
      .then(contractEditInfo => {
        //notification of editing contract
        return User.findOne({ _id: req.body.toUserId }).then(receiver => {
          return User.findOne({ _id: req.body.fromUserId }).then(sender => {
            let msg = `${sender.first} wants to edit your contract`;
            pushNotification.iosPush(receiver.deviceToken, {
              message: msg
            });
            androidNotification.androidPush(receiver.deviceToken, {
              message: msg
            });

            return ReS(res, {
              message: "Request for contract edit posted successfully",
              contractEditInfo: contractEditInfo
            });
          });
        });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  });
};

// accepting the contract edit

module.exports.contractEditAccept = (req, res) => {
  contractEdit
    .findOneAndUpdate(
      { _id: req.params.id }, //get vcontactedit id
      { $set: { isAccept: req.body.isAccept } },
      { upsert: true, new: true }
    )
    .populate("contractInfo fromUserId toUserId")
    .then(acceptance => {
      if (acceptance.isAccept == 1) {
        //update price in jobs collection
        Jobs.findOneAndUpdate(
          {
            user_id: acceptance.contractInfo.fromUserId,
            $or: [
              { _id: acceptance.contractInfo.jobId },
              { "lineHeight._id": acceptance.contractInfo.lineItemId }
            ]
          },
          {
            $set: { jobCost: acceptance.newPrice }
          },
          { upsert: true, new: true }
        ).then(jobPrice => {});
        //notification of acceptance
        return User.findOne({ _id: acceptance.fromUserId._id }).then(
          receiver => {
            return User.findOne({ _id: acceptance.toUserId._id }).then(
              sender => {
                let msg = `${
                  sender.first
                } accepted your contract edit request `;
                pushNotification.iosPush(receiver.deviceToken, {
                  message: msg
                });
                androidNotification.androidPush(receiver.deviceToken, {
                  message: msg
                });
                return ReS(res, {
                  message:
                    "Successfully updated aceeptance of the contractor edit",
                  acceptance: acceptance
                });
              }
            );
          }
        );
      } else {
        //job status = posted
        Jobs.findOneAndUpdate(
          {
            user_id: acceptance.contractInfo.fromUserId,
            $or: [
              { _id: acceptance.contractInfo.jobId },
              { "lineHeight._id": acceptance.contractInfo.lineItemId }
            ]
          },
          {
            $set: { jobStatus: "posted" }
          },
          { upsert: true, new: true }
        ).then(jobDetails => {});
        //notification of rejection
        return User.findOne({ _id: acceptance.fromUserId._id }).then(
          receiver => {
            return User.findOne({ _id: acceptance.toUserId._id }).then(
              sender => {
                let msg = `${sender.first} rejected your contract  `;
                pushNotification.iosPush(receiver.deviceToken, {
                  message: msg
                });
                androidNotification.androidPush(receiver.deviceToken, {
                  message: msg
                });
                return ReS(res, {
                  message:
                    "Successfully updated aceeptance of the contractor edit",
                  acceptance: acceptance
                });
              }
            );
          }
        );
      }
    })

    .catch(e => {
      return ReE(res, e, 422);
    });
};
