const express = require('express');
const router = express.Router();
//const PostJobController 	= require('../controllers/postjob.controller');
const postJobs = require("../models/postjob.model");


// create the details
router.post('/postjob', (req, res, next) => {
  let obj = [
    {
      jobTitle:req.body.jobTitle,
      quote:req.body.quote,
      jobLocation:req.body.jobLocation,
      propertyType:req.body.propertyType,
      jobStart:req.body.jobStart,
      postExpiry:req.body.postExpiry,
      interior:req.body.interior,//interior or exterrior
      newConstruction:req.body.newConstruction,//new construction or renovation
      occupied:req.body.occupied,//occupied or vacant
      materialSupplied:req.body.materialSupplied,//if partial take input fileds(all,partial,none)
      toolsSupplied:req.body.toolsSupplied,//if partial take input fileds(all,partial,none)
      postAs:req.body.postAs,//full or line height
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
