const mongoose = require("mongoose");
const lineHeightSchema = new mongoose.Schema(
  {
    Room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addRoomsSchema"
    },
    jobTitle: {
      type: String,
      required: true
    },
    floorLevel: {
      type: String,
      required: true
    },
    jobTrade: {
      type: String,
      required: true
    },
    jobWork: {
      type: String,
      required: true
    },
    desc: {
      type: String
    },
    isFixed: {
      type: Number,
      enum: [0, 1] // 0 - hourly 1- fixed
    },
    fixedCost: {
      type: Number
    },
    hourlyCost: {
      type: Number
    },
    hourlyTotal: {
      type: Number
    },
    hourlyDuration: {
      type: Number
    }
  },
  {
    versionKey: false
  }
);
const addRoomsSchema = new mongoose.Schema(
  {
    Room: {
      type: Number,
      enum: [1, 2, 3, 4]
    },
    details: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
);

const JobSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    isQuote: {
      type: Number,
      enum: [0, 1] // Quote - 1 fixed - 0
    },
    jobLocation: {
      type: String,
      required: true,
      trim: true
    },
    propertyType: {
      type: String,
      required: true,
      trim: true
    },
    jobStart: {
      type: Date,
      default: Date.now, //yyyy-mm-dd for postman
      required: "Must have start date - default value is the created date"
    },
    postExpiry: {
      type: Date,
      default: Date.now, //yyyy-mm-dd for postman
      required: "Must have start date - default value is the created date"
    },
    isInterior: {
      type: Number,
      required: true,
      enum: [1, 2]
    }, //interior - 1 or exterrior - 2
    isNewConstruction: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    isOccupied: {
      type: Number,
      required: true,
      enum: [1, 2]
      //occupied - 1 or vacant - 2
    }, //new construction - 1 or renovation - 2
    matsupplied: String,
    matsupDetails: String, //if partial take input fileds(all - 1 partial - 2 ,none - 3)
    toolsupplied: String,
    toolsupDetails: String, //if partial take input fileds(all - 1 partial - 2 ,none - 3),//if partial take input fileds(all - 1,partial - 2 ,none - 3)
    isPostAs: {
      type: Number,
      enum: [1, 2]
    }, //full - 1 or line height - 2
    addRoom: {
      type: [addRoomsSchema],
      required: true
    },

    lineHeight: [lineHeightSchema]
  },
  { timestamps: true, versionKey: false }
);

const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;
