const express = require('express');
const router = express.Router();
//const PostJobController 	= require('../controllers/postjob.controller');
const postJobs = require("../models/postjob.model");


// create the details
router.post('/postjob', (req, res, next) => {
  let obj = [
    {
      jobTitle:req.body.jobTitle,
      isQuote:req.body.isQuote,//quote - 1 fixed - 0
      jobLocation:req.body.jobLocation,
      propertyType:req.body.propertyType,
      jobStart:req.body.jobStart,
      postExpiry:req.body.postExpiry,
      isInterior:req.body.isInterior,//interior - 1 or exterrior - 2
      isNewConstruction:req.body.isNewConstruction,//new construction - 1 or renovation - 2
      isOccupied:req.body.isOccupied,//occupied -1 or vacant - 2
      isMaterialSupplied:req.body.isMaterialSupplied,//if partial take input fileds(all - 1 partial - 2 ,none - 3)
      isToolsSupplied:req.body.isToolsSupplied,//if partial take input fileds(all - 1,partial - 2 ,none - 3)
      isPostAs:req.body.isPostAs,//full - 1 or line height - 2
    }
  ];
  var postJobSave = new postJobs(req.body)
  postJobSave.save(function(err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(docs);
      res.json(docs);
    }
  });
});




module.exports = router;
