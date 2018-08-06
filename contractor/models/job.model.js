const mongoose 	= require('mongoose');
const JobSchema = new mongoose.Schema({
        jobTitle:String,
        isQuote:Number,
        jobLocation:String,
        propertyType:String,
        jobStart:{
                		type: Date,
                		default: +new Date(),//yyyy-mm-dd for postman
                		required: 'Must have start date - default value is the created date'
                	},
        postExpiry:{
                		type: Date,
                		default: +new Date(),//yyyy-mm-dd for postman
                		required: 'Must have start date - default value is the created date'
                	},
        isInterior: Number,//interior - 1 or exterrior - 2
        isNewConstruction:Number,//new construction - 1 or renovation - 2
        isOccupied:Number,//occupied - 1 or vacant - 2
        isMaterialSupplied: {
                              type: 'Number',
                              enum: [1,2,3],
                            },//if partial take input fileds(all - 1 partial - 2 ,none - 3)
        isToolsSupplied:{
                              type: 'Number',
                              enum: [1,2,3],
                            },//if partial take input fileds(all - 1 partial - 2 ,none - 3),//if partial take input fileds(all - 1,partial - 2 ,none - 3)
        isPostAs:Number, //full - 1 or line height - 2
     });


const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;
