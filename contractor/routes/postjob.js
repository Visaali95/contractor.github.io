const express = require('express');
const router = express.Router();
const PostJobController 	= require('../controllers/postjob.controller');
const mongoose = require('mongoose');


// create the details
router.post('/abc', (req, res, next) => {
  let postjobs = [
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

  PostJob.collection.insert(postjobs, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(postjobs);
      res.send(postjobs);
    }
  });
});




module.exports = router;
