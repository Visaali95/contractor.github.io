const express = require('express');
const router = express.Router();
//const PostJobController 	= require('../controllers/postjob.controller');
const comments = require("../models/comment.model");


// create the details
router.post('/comments', (req, res, next) => {
  var commentsSave = new comments({
      user_id: req.body.user_id,
      rooms: req.body.rooms,
  });
  commentsSave.save(function(err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(docs);
    comments.find({}).populate("user_id").exec((err, data) => {
      if(err){
        console.log(err);
      }
      res.json({res : data});
    })

    }
  });
});




module.exports = router;
