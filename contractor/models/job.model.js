const mongoose = require("mongoose");
const lineHeightSchema = new mongoose.Schema(
  {
    Room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addRoomsSchema"
    },
    jobTitle: {
      type: String,
      default: ""
    },
    floorLevel: {
      type: String,
      default: ""
    },
    jobTrade: {
      type: String,
      default: ""
    },
    jobWork: {
      type: String,
      default: ""
    },
    desc: { type: String, default: "" },
    isFixed: {
      type: Number,
      enum: [0, 1]
      // 0 - hourly 1- fixed
    },
    fixedCost: {
      type: Number,
      default: 0
    },
    hourlyCost: {
      type: Number,
      default: 0
    },
    hourlyTotal: {
      type: Number,
      default: 0
    },
    hourlyDuration: {
      type: Number,
      default: 0
    },
    lineItemPics: { type: [String] }
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
      default: ""
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
      trim: true,
      default: ""
    },
    isQuote: {
      type: Number,
      enum: [0, 1] // Quote - 1 fixed - 0
    },
    jobLocation: {
      type: String,
      trim: true,
      required: true
    },
    latitude: {
      type: Number,
      trim: true
    },
    longitude: {
      type: Number,
      trim: true
    },
    geo: {
      type: [Number],
      index: "2d"
    },
    propertyType: {
      type: String,
      required: true,
      trim: true,
      default: ""
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
    matsupplied: { type: String, default: "" },
    matsupDetails: { type: String, default: "" }, //if partial take input fileds(all - 1 partial - 2 ,none - 3)
    toolsupplied: { type: String, default: "" },
    toolsupDetails: { type: String, default: "" }, //if partial take input fileds(all - 1 partial - 2 ,none - 3),//if partial take input fileds(all - 1,partial - 2 ,none - 3)
    isPostAs: {
      type: Number,
      enum: [1, 2]
    }, //full - 1 or line height - 2
    addRoom: {
      type: [addRoomsSchema],
      required: true
    },

    lineHeight: [lineHeightSchema],
    jobStatus: {
      type: String,
      enum: ["posted", "ongoing", "completed", "deactivated"]
    },
    jobCost: { type: Number, default: 0 }
  },

  { timestamps: true, versionKey: false }
);

const Jobs = mongoose.model("Jobs", JobSchema);
module.exports = Jobs;
