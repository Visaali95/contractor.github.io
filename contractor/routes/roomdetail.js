const express = require('express');
const router = express.Router();
const roomDetail = require("../models/roomdetail.model");


// create the details
router.post('/roomdetail', (req, res, next) => {
  var roomDetailSave = new roomDetail({
    type_interior:req.body.type_interior,
    type_room:req.body.type_room,
    name:req.body.name,
  });
  roomDetailSave.save(function(err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(docs);
      roomDetail.find({}).populate('interior').populate('rooms').exec((err, data) => {
      if(err){
        console.log(err);
      }
      res.json({res : data});
    })

    }
  });
});




module.exports = router;
