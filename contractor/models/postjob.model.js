const mongoose 	= require('mongoose');

const PostJobSchema = new mongoose.Schema({
        jobTitle:String,
        quote:String,
        jobLocation:String,
        propertyType:String,
        jobStart:String,
        postExpiry:String,
        interior:String,//interior or exterrior
        newConstruction:String,//new construction or renovation
        occupied:String,//occupied or vacant
        materialSupplied:String,//if partial take input fileds(all,partial,none)
        toolsSupplied:String,//if partial take input fileds(all,partial,none)
        postAs:String, //full or line height
     });


const postJobs = mongoose.model("postJobs", PostJobSchema);
module.exports = postJobs;
