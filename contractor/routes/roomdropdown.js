const express = require('express');
const router = express.Router();
const roomDropDown = require("../models/roomdropdown.model");

// create the details
router.post('/roomdropdown', (req, res, next) => {
  var roomDropDownSave = new roomDropDown({
    name:req.body.name,
    Interior:req.body.Interior,
    Exterior:req.body.Exterior,
  });
  roomDropDownSave.save(function(err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("documents inserted to Collection");
      console.log(docs);
      res.json({docs});
    }
  });


  });




// fetch interior details
router.get('/roomdropdown/interior', (req, res, next) => {
  // Using query builder
roomDropDown.
  find().
  where('Interior').equals('1').
  exec((err, data) => {
      if(err){
        console.log(err);
      }
      console.log({data})
      res.send({data});
    })

})

// fetch exterior data

router.get('/roomdropdown/exterior', (req, res, next) => {
  // Using query builder
roomDropDown.
  find().
  where('Exterior').equals('1').
  exec((err, data) => {
      if(err){
        console.log(err);
      }
      console.log({data})
      res.send({data});
    })
})




module.exports = router;
