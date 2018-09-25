const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcrypt_p = require("bcrypt-promise");
const jwt = require("jsonwebtoken");
const Company = require("./company.model");
const validate = require("mongoose-validator");
const { TE, to } = require("../services/util.service");
const CONFIG = require("../config/config");

let UserSchema = mongoose.Schema(
  {
    first: { type: String, default: "" },
    last: { type: String, default: "" },
    phone: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      index: true, //sparse is because now we have two possible unique keys that are optional
      default: true,
      validate: {
        validator: function(v) {
          var re = /^\d{10}$/;
          return v == null || v.trim().length < 1 || re.test(v);
        },
        message: "Provided phone number is invalid."
      }
      // validate: [
      //   validate({
      //     validator: "isNumeric",
      //     arguments: [7, 20],
      //     message: "Not a valid phone number."
      //   })
      // ]
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      validate: [
        validate({
          validator: "isEmail",
          message: "Not a valid email."
        })
      ]
    },
    password: { type: String, default: "" },
    postcode: {
      type: String,
      validate: [
        validate({
          validator: "isNumeric",
          message: "Not a valid postcode."
        })
      ]
    },
    fbid: { type: String, trim: true, index: true, default: "" },
    twitterid: { type: String, trim: true, index: true, default: "" },
    pintrestid: { type: String, trim: true, index: true, default: "" },
    instaid: { type: String, trim: true, index: true, default: "" },
    userType: {
      type: String,
      trim: true,
      enum: ["Builder", "Contractor", "Sub-contractor", "independent", ""],
      default: ""
    },
    status: { type: Boolean, default: true },
    otp: {
      type: String,
      trim: true,
      default: ""
    },
    deviceToken: { type: String, default: "" },
    userImg: { type: String, default: "" },
    isEmailUpdates: { type: Boolean, default: false },
    isAcceptTerms: { type: Boolean, default: false },
    isSignUpDetails: { type: Boolean },
    isSignUpProfile: { type: Boolean, default: false },
    isSignUpCompany: { type: Boolean, default: false },
    userRole: {
      type: String,
      enum: ["Super Admin", "Admin", "User"],
      default: "User"
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

UserSchema.virtual("companies", {
  ref: "Company",
  localField: "_id",
  foreignField: "users.user",
  justOne: false
});

UserSchema.pre("save", async function(next) {
  if (this.isModified("password") || this.isNew) {
    let err, salt, hash;
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) TE(err.message, true);

    [err, hash] = await to(bcrypt.hash(this.password, salt));
    if (err) TE(err.message, true);

    this.password = hash;
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function(pw) {
  let err, pass;
  if (!this.password) TE("password not set");

  [err, pass] = await to(bcrypt_p.compare(pw, this.password));
  if (err) TE(err);

  if (!pass) TE("invalid password");

  return this;
};

UserSchema.methods.Companies = async function() {
  let err, companies;
  [err, companies] = await to(Company.find({ "users.user": this._id }));
  if (err) TE("err getting companies");
  return companies;
};

UserSchema.virtual("full_name").set(function(name) {
  var split = name.split(" ");
  this.first = split[0];
  this.last = split[1];
});

UserSchema.virtual("full_name").get(function() {
  //now you can treat as if this was a property instead of a function
  if (!this.first) return null;
  if (!this.last) return this.first;

  return this.first + " " + this.last;
});

UserSchema.methods.getJWT = function() {
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  return (
    "Bearer " +
    jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, {
      expiresIn: expiration_time
    })
  );
};

UserSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};
let User = (module.exports = mongoose.model("User", UserSchema));
