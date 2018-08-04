const express = require('express');
const router = express.Router();
//const PostJobController 	= require('../controllers/postjob.controller');
const addRooms = require("../models/addrooms.model");


// create the details
router.post('/addrooms', (req, res, next) => {
  var addRoomsSave = new addRooms({
      user_id: req.body.user_id,
      rooms: req.body.rooms,
  });
  addRoomsSave.save(function(err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(docs);
    addRooms.find({}).populate("user_id").exec((err, data) => {
      if(err){
        console.log(err);
      }
      res.json({res : data});
    })

    }
  });
});




module.exports = router;
