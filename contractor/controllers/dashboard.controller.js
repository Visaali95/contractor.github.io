const Jobs = require('../models/job.model')
const User = require('../models/user.model')
const {  ReE, ReS }  = require('../services/util.service');

const fetch = (req, res) => {
//   Jobs.findOne({ $or: [{'userDetails.userType': 'Builder' },{'userDetails.userType': 'independent' },{'userDetails.userType': 'Sub-contractor' },,{'userDetails.userType': 'Contractor' }]}).select({jobTitle:1,jobLocation:1,userDetails:1}).then((result)=> {
    
//     return ReS(res, {message:"validated your data", result: {details:result}})
    
//   }).catch((e)=>{

//     return ReE(res, e, 422);
//   })

// };
Jobs.findOne ({user_id:req.params.user_id})
.populate('user_id')
.exec((err,result) => {
  if(err) 
  return ReE(res, e, 422);
  else
  return ReS(res, {message:"success", result:result})
})
}

module.exports.fetch = fetch;
