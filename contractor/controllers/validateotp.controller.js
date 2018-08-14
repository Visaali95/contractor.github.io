const User = require('../models/user.model');
const {  ReE, ReS }  = require('../services/util.service');

const create = (req, res) => {


  User.findOne({
    email:req.body.email,
    otp:req.body.otp
  },).then((result)=> {
    
    return ReS(res, {message:"validated your data", result: result.email})
    
  }).catch((e)=>{

    return ReE(res, {e:"email id and otp did not match"}, 422);
  })

};
module.exports.create = create;
