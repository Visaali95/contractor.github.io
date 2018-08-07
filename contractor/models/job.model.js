const mongoose 	= require('mongoose');
const User = require('./user.model');
const lineHeightSchema = new mongoose.Schema({
   jobTitle:{
     type:String,
     required:true,
   },
   floorLevel:{
     type:Number,
     required:true,
   },
   jobArea:{
     type:Number,
     required:true,
   },
   desc:{
     type:String,
   },
   isFixed:{
     type:Number,
     enum:[0,1],
   },
   cost:{
     type:Number,
     required:true,
   },
  total:{
    type:Number,
    required:true,
  }
},{_id:false,
  versionKey:false,
timestamps:true})
const addRoomsSchema = new mongoose.Schema({

    Room:{
      type:Number,
      enum:[1,2,3,4],
    },
    details:{
      type:Number,
      required:true,
    },
    lineHeight:[lineHeightSchema],


},{ _id:false,
  versionKey:false})
const JobSchema = new mongoose.Schema({
        user_id:{
          type: mongoose.Schema.Types.ObjectId,
          ref:'User'
        },
        jobTitle:{
          type:String,
          required:true,
          trim:true,
        },
        isQuote:{
          type:Number,
          required:true,
        },
        jobLocation:{
          type:String,
          required:true,
          trim:true,
        },
        propertyType:{
          type:String,
          required:true,
          trim:true,
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
        addRoom:[addRoomsSchema],
     },{versionKey:false});


const lineHeight = mongoose.model("lineHeight",lineHeightSchema);
const addRooms = mongoose.model("addRooms",addRoomsSchema);
const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;