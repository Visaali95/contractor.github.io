const mongoose 	= require('mongoose');
const addRoomsSchema = new mongoose.Schema({

    Rooms:{
      type:Number,
      enum:[1,2,3,4],
    },
    details:{
      type:Number,
      required:true,
    }

})
const JobSchema = new mongoose.Schema({
        jobTitle:{
          type:String,
          required:true,
        },
        isQuote:{
          type:Number,
          required:true,
        },
        jobLocation:{
          type:String,
          required:true,
        },
        propertyType:{
          type:String,
          required:true,
        },
        jobStart:{
                		type: Date,
                		default: Date.now,//yyyy-mm-dd for postman
                		required: 'Must have start date - default value is the created date'
                	},
        postExpiry:{
                		type: Date,
                		default: Date.now,//yyyy-mm-dd for postman
                		required: 'Must have start date - default value is the created date'
                	},
        isInterior: {
          type:Number,
          required:true,
        },//interior - 1 or exterrior - 2
        isNewConstruction:{
          type:Number,
          required:true,
        },//new construction - 1 or renovation - 2
        isOccupied:{
          type:Number,
          required:true,
        },//occupied - 1 or vacant - 2
        isMaterialSupplied: {
                              type: 'Number',
                              enum: [1,2,3],
                            },//if partial take input fileds(all - 1 partial - 2 ,none - 3)
        isToolsSupplied:{
                              type: 'Number',
                              enum: [1,2,3],
                            },//if partial take input fileds(all - 1 partial - 2 ,none - 3),//if partial take input fileds(all - 1,partial - 2 ,none - 3)
        isPostAs:Number, //full - 1 or line height - 2
        addRoom:addRoomsSchema,
     });

const addRooms = mongoose.model("addRooms",addRoomsSchema);
const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;
