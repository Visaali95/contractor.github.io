const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const { TE, to } = require("../services/util.service");

let CompanySchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    location: { type: String, default: "" },
    postcode: { type: String, default: "" },
    domain: { type: String, default: "" },
    ratings: { type: Number, enum: [1, 2, 3, 4, 5] },
    logo: { type: String, default: "" },
    pictures: { type: [String], default: [] },
    companyAbout: { type: String, default: "" },
    companySocial: { type: String, default: "" },
    isLicense: {
      type: Number,
      enum: [0, 1]
    },
    companyLicense: { type: String, default: "" }
  },
  { timestamps: true }
);

CompanySchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

let company = (module.exports = mongoose.model("Company", CompanySchema));
