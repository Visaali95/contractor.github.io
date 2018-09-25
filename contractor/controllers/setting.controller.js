const express = require("express");
var multer = require("multer");
var { User } = require("../models/user.model");
var { Setting } = require("../models/setting.model");
const assignJobs = require("../models/assignjobs.model");
const Jobs = require("../models/job.model");
const HummusRecipe = require("hummus-recipe");
var fs = require("fs");

//var serverUploads =  "/home/parangat-pt-35/Desktop/Projects/contractor_api/public/";
var serverUploads = "/home/ubuntu/api/public/images/uploads/";
const { to, ReE, ReS } = require("../services/util.service");

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, serverUploads);
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024
  }
}).array("file", 3);

exports.contract = (req, res, next) => {
  debugger;
  var type = req.query.type;
  let url = "http://18.222.231.171:8081/";
  // let url = "/home/parangat-pt-35/Desktop/Projects/revfin_backend/public/";
  assignJobs
    .find({ toUserId: req.query.id })
    .then(assignjob => {
      var lineid = assignjob[0].lineItemId;
      var userid = assignjob[0].toUserId;
      Setting.findByType(type)
        .then(
          setting => {
            lineItemId = [];

            Jobs.find(
              { "lineHeight._id": lineid },
              { "lineHeight.$": 1 },

              { user_id: userid }
            ).then(
              jobres => {
                console.log("setting", setting);
                if (setting == null) {
                  res
                    .status(400)
                    .send({ status: 400, result: "No Images Found" });
                } else {
                  debugger;
                  var path = serverUploads + setting.image;
                  console.log("path", path);
                  var outputFile =
                    "output" + type + Math.floor(Date.now() / 1000) + ".pdf";
                  const pdfDoc = new HummusRecipe(
                    path,
                    serverUploads + outputFile
                  );
                  var user = "abc";
                  var enduser = "xyz";
                  var jobTitle = "Faucet Change";
                  var floorLevel = "floorLevel";
                  var jobTrade = "PLUMBER";
                  var desc =
                    "Require a person to clean the tub from bottom and resolve the issue of mixing warm water.";
                  var fixedcost = "null";
                  var houlycost = "50";
                  pdfDoc
                    // edit 1st page
                    .editPage(1)
                    .text(user, 100, 130, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(enduser, 300, 130, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .endPage()
                    .editPage(3)
                    .text(jobTitle, 250, 410, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(floorLevel, 250, 430, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(jobTrade, 250, 450, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(desc, 250, 470, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(fixedcost, 250, 490, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .text(houlycost, 250, 510, {
                      color: "0d0e0f",
                      fontSize: 8
                    })
                    .endPage() // end and save

                    .endPDF();
                  res.status(200).json({
                    status: 200,
                    filename: url + outputFile,

                    message: "Get aggrement Pdf"
                  });
                }
              },
              e => {
                debugger;
                res.status(400).send({ status: 400, message: e.message });
              }
            );
          },
          e => {
            debugger;
            res.status(400).send({ status: 400, message: e.message });
          }
        )
        .catch(e => {
          res.status(400).send({ status: 400, message: e.message });
        });
    })
    .catch(e => {
      res.status(400).send({ status: 400, message: e.message });
    });
};

exports.addSetting = (req, res, next) => {
  debugger;
  var userinfo = req.user;
  let url = "http://18.222.231.171:8081/";
  upload(req, res, function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
    } else {
      var data = req.body;
      data.image = req.files[0].filename;
      var type = req.body.type;
      Setting.findByType(type)
        .then(images => {
          if (images == null) {
            var setting = new Setting(data);
            setting.save(function(err, data) {
              if (err) {
                res.status(200).json({
                  status: 200,
                  filename: url + req.files,
                  message: "Image Uploaded Successfully"
                });
              } else {
                res.json({ status: 200, result: data });
              }
            });
          } else {
            Setting.findOneAndUpdate({ _id: images._id }, { $set: data })
              .then(resp => {
                debugger;
                res.status(200).json({
                  status: 200,
                  result: resp,
                  message: "Setting Updated"
                });
              })
              .catch(e => {
                debugger;
                res.status(400).send({ status: 400, result: e.message });
              });
          }
        })
        .catch(e => {
          res.status(400).send({ status: 400, message: e.message });
        });
    }
  });
};

exports.getAllSetting = (req, res, next) => {
  Setting.find({})
    .then(
      setting => {
        if (setting == null) {
          res.status(400).send({ status: 400, result: "No Data Found" });
        } else {
          debugger;

          res.status(200).json({
            status: 200,
            result: setting,

            message: "Get All Loan Terms And Agreement setting Data"
          });
        }
      },
      e => {
        debugger;
        res.status(400).send({ status: 400, message: e.message });
      }
    )
    .catch(e => {
      res.status(400).send({ status: 400, message: e.message });
    });
};

exports.getimages = (req, res, next) => {
  var type = req.query.type;
  let url = "http://18.222.231.171:8081/";
  var pathname;

  Setting.find({ type: type }).then(
    images => {
      if (images == null) {
        res.status(400).send({ status: 400, message: "No Images Found" });
      } else {
        pathname = images[0].image;

        debugger;
        var path = url + pathname;
        var img = fs.readFileSync(path);
        res.status(200).json({
          status: 200,
          filename: path,

          message: "Get aggrement Pdf"
        });
      }
    },
    e => {
      res.status(400).send({ status: 400, message: e.message });
    }
  );
};
