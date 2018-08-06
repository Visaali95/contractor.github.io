const express = require('express');
const router = express.Router();
//const PostJobController 	= require('../controllers/postjob.controller');
const Jobs = require("../models/job.model");


// create the details
router.post('/job', (req, res, next) => {
  var JobSave = new Jobs(req.body)
  JobSave.save().then((jobs)=> {
    console.log(jobs)
    res.send(jobs)
  }).catch((e)=>{
    console.log(e)
  })

})

module.exports = router;
