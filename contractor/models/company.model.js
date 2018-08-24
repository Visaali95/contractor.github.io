const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const { TE, to } = require("../services/util.service");

let CompanySchema = mongoose.Schema(
  {
    name: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    location: { type: String },
    postcode: { type: String },
    domain: { type: String },
    ratings: { type: Number, enum: [1, 2, 3, 4, 5] },
    logo: { type: String },
    pictures: { type: String }
  },
  { timestamps: true }
);

CompanySchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

let company = (module.exports = mongoose.model("Company", CompanySchema));
