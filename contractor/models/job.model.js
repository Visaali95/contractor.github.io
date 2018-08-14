const mongoose 	= require('mongoose');
const validate  = require('mongoose-validator');

const lineHeightSchema = new mongoose.Schema({
   Room_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'addRoomsSchema'
  },
   jobTitle:{
     type:String,
     required:true,
   },
   floorLevel:{
     type:Number,
     required:true,
   },
   jobArea:{
     type:String,
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
  },
  duration:{
    type:Number,
    required:true,
  }
},{_id:false,
  versionKey:false})
const addRoomsSchema = new mongoose.Schema({

    Room:{
      type:Number,
      enum:[1,2,3,4],
    },
    details:{
      type:String,
      required:true,
    },

},{ versionKey:false})

const JobSchema = new mongoose.Schema({
        user_id:{
          type: mongoose.Schema.Types.ObjectId,
           ref: 'User'
        },
        jobTitle:{
          type:String,
          required:true,
          trim:true,
        },
        isQuote:{
          type:Number,
          enum:[0,1],
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
          enum:[1,2],
        },//interior - 1 or exterrior - 2
        isNewConstruction:{
          type:Number,
          required:true,
          enum:[1,2],
          isOccupied:{
            type:Number,
            required:true,
            enum:[1,2],
          },//occupied - 1 or vacant - 2
        },//new construction - 1 or renovation - 2
        matsupplied:String,
        matsupDetails:String,//if partial take input fileds(all - 1 partial - 2 ,none - 3)
        toolsupplied:String,
        toolsupDetails:String,//if partial take input fileds(all - 1 partial - 2 ,none - 3),//if partial take input fileds(all - 1,partial - 2 ,none - 3)
        isPostAs:{
          type:Number,
          enum:[1,2],
         }, //full - 1 or line height - 2
        addRoom:{
          type:[addRoomsSchema],
          required: true,
        },

        lineHeight:[lineHeightSchema],
     },{versionKey:false});

const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;
