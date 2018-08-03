const mongoose 			= require('mongoose');

var PostJobSchema = new mongoose.Schema({
        jobTitle:String,
        quote:String,
        jobLocation:String,
        propertyType:String,
        jobStart:Date,
        postExpiry:Date,
        interior:String,//interior or exterrior
        newConstruction:String,//new construction or renovation
        occupied:String,//occupied or vacant
        materialSupplied:String,//if partial take input fileds(all,partial,none)
        toolsSupplied:String,//if partial take input fileds(all,partial,none)
        postAs:String, //full or line height
     });


var PostJob = mongoose.model("PostJob", PostJobSchema);
module.exports = { PostJob };
