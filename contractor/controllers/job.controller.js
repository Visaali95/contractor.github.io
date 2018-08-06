const mongoose = require("mongoose");
const Jobs = mongoose.model("Jobs");

exports.jobController = (req, res) => {
  req.body.user_id = req.user._id.toString()
  var JobSave = new Jobs(req.body)
  JobSave.save().then((jobs)=> {
    res.send(jobs)
  }).catch((e)=>{
    console.log(e)
  })

};
