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
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "/home/parangat-pt-01/Documents/ParangatTechnologies/contractor_api/public/images/uploads"
    );
    // cb(null, "/home/ubuntu/api/public/images/uploads");
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
//var upload = multer({storage: storage}).single('image');
//var upload = multer().array('photos',10);
//var photos = [];

// lineItem create or line Item update
const updatelineheights = (req, res) => {
  //res.setHeader("Content-Type", "application/json");
  let lineHeightRequest = JSON.parse(req.body.lineHeight);
  for(i=0;i<lineHeightRequest.length;i++){
    var upload = multer({
      storage: storage,
      limits: {
        fileSize: 1073741824
      }
    }).fields([{ name: `photos${i}`, maxCount: 10 }]);
  }
 
  upload(req, res, function(err) {
    let lineHeightRequest = JSON.parse(req.body.lineHeight);
    console.log(req.body);
    console.log(req.files);

    if (err) {
      return ReE(res, err, 422);
    }
    // NORMAL UPLOAD

    // if (req.files) {
    //   var lineItemPics = [];
    //   var photos = req.files.photos;
    //   if (photos == undefined) {
    //     lineItemPics = [];
    //   } else
    //     photos.map(photo => {
    //       lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
    //       lineItemPics = lineItemPics;
    //     });
    // }

    // if (req.files) {
    //   var lineItemPics = [];
    //   lineHeightRequest.map(lh => {
    //     pics = req.files.photos;
    //     if (pics == undefined) {
    //       lineItemPics = [];
    //     } else {
    //       pics.map(photo => {
    //         lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
    //         lh["lineItemPics"] = lineItemPics;
    //       });
    //     }
    //   });
    // }

    // if (req.files) {
    //   var lineItemPics = [];
    //   req.files.map(file => {
    //     pics = req.files.photos;
    //     if (pics == undefined) {
    //       lineItemPics = [];
    //     } else {
    //       pics.map(photo => {
    //         lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
    //         lineHeightRequest.map(lh => {
    //           lh["lineItemPics"] = lineItemPics;
    //         });
    //       });
    //     }
    //   });
    // }

    // for (let i = 0; i < req.body.lineHeight.length; i++) {
    //   req.body.lineHeight[`${i}`]["lineItemPics"] = req.files.photos;
    //   //var photos = req.files.photos;
    //   if (req.body.lineHeight[`${i}`]["lineItemPics"] == undefined) {
    //     lineItemPics = [];
    //   } else
    //     req.body.lineHeight[`${i}`]["lineItemPics"].map(photo => {
    //       lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
    //       req.body.lineHeight[`${i}`]["lineItemPics"] = lineItemPics;
    //     });
    // }
    // }
    // pics(lineItemPics);

    // lineHeight.map(job => {
    //   job.lineItemPics.push(lineItemPics);
    // });
    //job_info = lineItemPics;
    //  }
    // LH UPLOAD BASED ON INDEX NO
// for(i=0;i<lineHeightRequest.length;i++){
//  `lineItemPics${i}` = [];
 
//     if(req.files[`photos${i}`]) {
//        `photos${i}` = req.files[`photos${i}`];
//       if (`photos${i}` == undefined) {
//         `lineItemPics${i}` = [];
//       } else
//       `photos${i}`.map(photo => {
//           `lineItemPics${i}`.push("http://18.222.231.171:8081/" + photo.filename);
//           `lineItemPics${i}` = `lineItemPics${i}`;
//         });
//       // pics(lineItemPics);
//     }
    // if (req.files.lh1) {
    //   var lh1 = req.files.lh1;
    //   if (lh1 == undefined) {
    //     lIPics1 = [];
    //   } else
    //     lh1.map(photo => {
    //       lIPics1.push("http://18.222.231.171:8081/" + photo.filename);
    //       lIPics1 = lIPics1;
    //     });
    //   // pics(lineItemPics);
    // }

//}
    
  

    Jobs.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          lineHeight: lineHeightRequest
          //"lineHeight.$.lineItemPics": lineItemPics
        }
      },
      {
        new: true
      }
    )
      .then(lineHeight => {
        // lineHeight.lineHeight.map(lh => {
        //   lh.lineItemPics.push(lineItemPics);
        // });

        lineHeight.lineHeight.map(lh => {
          for (i = 0; i < lineHeightRequest.length; i++) {
          var photos = req.files[`photos${i}`];
          }
          if (photos == undefined) {
            lh.lineItemPics = [];
          } else
            photos.map(photo => {
              lh.lineItemPics.push("http://18.222.231.171:8081/" + photo.filename);
              //lh.lineItemPics = lineItemPics;
            });
          
          //req.body.lineHeight = lh.lineItemPics;
          
        });

        // pics = lineItemPics => {
        lineHeight.lineHeight.map(lh => {
        for (i = 0; i < lineHeightRequest.length; i++) {
          if (`lineItemPics${i}`) {
            lineHeight.lineHeight[i].lineItemPics.push(`lineItemPics${i}`);
          }
       }

        // if (lIPics0) {
        //   lineHeight.lineHeight[0].lineItemPics.push(lIPics0);
        // }
        // if (lIPics1) {
        //   lineHeight.lineHeight[1].lineItemPics.push(lIPics1);
        // }
        // if (lh[1]) {
        //   lh.lineItemPics.push(lIPics1);
        // }
        // });
        // };

        return ReS(res, {
          message: "Updated Successfully",
          lineHeight: lineHeight.lineHeight
        });
      })
      .catch(e => {
        return ReE(res, e, 422);
      });
  //});
});
 
module.exports.updatelineheights = updatelineheights;
