const Jobs = require('../models/job.model');
const {  ReE, ReS }  = require('../services/util.service');
const _  = require("lodash")

const create = (req, res) => {

  var JobSave = new Jobs(req.body)
  JobSave.save().then((jobs)=> {
    return ReS(res, {message:"Updated Successfully", jobs: jobs._id});
  }).catch((e)=>{

    return ReE(res, e, 422);
  })

};
module.exports.create = create;

const updatelineheights = (req, res) => {
    
    Jobs.findOneAndUpdate(
      {_id:req.params._id},
      {
        $set:{ lineHeight : req.body.lineHeight}
      },
      {
        new : true
      }
    ).then((lineHeight)=> {
      return ReS(res, {message:"Updated Successfully", lineHeight: lineHeight.lineHeight});
    }).catch((e)=>{
  
      return ReE(res, e, 422);
    })
  
  };
  module.exports.updatelineheights = updatelineheights;

  const updaterooms = (req, res) => {
      
      Jobs.findOneAndUpdate(
        {_id:req.params._id},
        {
          $set:{ addRoom  : req.body.addRoom}
        },
        {
          new: true
        }
      ).then((rooms)=> {
      
        return ReS(res, {message:"Updated Successfully", rooms: rooms.addRoom});
      }).catch((e)=>{
    
        return ReE(res, e, 422);
      })
    
    };
    module.exports.updaterooms = updaterooms;

    const draftjob = (req,res) => {
     
     let drafts = []
      Jobs.find( {user_id:req.params.user_id,  $or:[{addRoom: { $size:0}},{lineHeight :{ $size:0}}]} )
      .then((draft)=> {
    
        if(!draft){
        throw("Draft not found")
        }
        draft.map((draftObj)=> {
          
          drafts.push(pickResponse(draftObj))
        })
        
        return ReS(res, {message:"Draft details", draft:drafts});
      }).catch((e)=>{
       
        return ReE(res, e, 422);
      })
    };
    module.exports.draftjob = draftjob;

    let pickResponse = ((data)=> {
      data = _.pick(data, ["_id","jobTitle","jobLocation","propertyType"])
      return data
    })


    const jobDetails = (req,res) => {
     
     
       Jobs.find( {_id:req.params.job_id} )
       .then((details)=> {
     
         if(!details){
         throw("Job not found")
         }
        
         return ReS(res, {message:"Draft details", details:details});
       }).catch((e)=>{
        
         return ReE(res, e, 422);
       })
     };
     module.exports.jobDetails = jobDetails;


const DashboardDetails = (req, res) => {
  let results = []
  Jobs.find({user_id:req.params.user_id})
  .populate('user_id')
  .then((result) => {    
    if(!result){
      throw("details not found")
      }
      result.map((resultObj)=> {        
        results.push(pickResult(resultObj))
      })
    return ReS(res, {message:"success", result:results})
  }).catch((e)=>{
        
    return ReE(res, e, 422);
  })
  }

  module.exports.DashboardDetails = DashboardDetails;


  let pickResult = ((result)=> {
    result = _.pick(result, ["jobTitle","jobLocation","propertyType","postExpiry","lineHeight","user_id.first","user_id.phone"])
    return result
  })
  