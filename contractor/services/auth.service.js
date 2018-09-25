const { User } = require("../models");
const validator = require("validator");
const { to, TE } = require("../services/util.service");

const getUniqueKeyFromBody = function(body) {
  // this is so they can send in 3 options unique_key, email, or phone and it will work
  let unique_key = body.unique_key;

  if (typeof unique_key === "undefined") {
    if (typeof body.fbid != "undefined" && body.fbid != "") {
      unique_key = body.fbid;
    } else if (typeof body.twitterid != "undefined" && body.twitterid != "") {
      unique_key = body.twitterid;
    } else if (typeof body.instaid != "undefined" && body.instaid != "") {
      unique_key = body.instaid;
    } else if (typeof body.pintrestid != "undefined" && body.pintrestid != "") {
      unique_key = body.pintrestid;
    } else if (typeof body.email != "undefined" && body.email != "") {
      unique_key = body.email;
    } else if (typeof body.phone != "undefined" && body.phone != "") {
      unique_key = body.phone;
    } else {
      unique_key = null;
    }
  }

  return unique_key;
};
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function(userInfo) {
  let unique_key, auth_info, err;

  auth_info = {};
  auth_info.status = "create";

  unique_key = getUniqueKeyFromBody(userInfo);
  if (!unique_key)
    TE("An email or phone number or social media was not entered.");

  if (!userInfo.email || userInfo.phone == "" || userInfo.password == "") {
    if (userInfo.fbid) {
      [err, user] = await to(User.findOne({ fbid: userInfo.fbid }));
      userInfo.password = "123";
      userInfo.postcode = "123456";
      userInfo.isEmailUpdates = true;
      userInfo.isAcceptTerms = true;
      if (Boolean(user)) TE("Facebook id already exits");
    }
    if (userInfo.twitterid) {
      userInfo.password = "123";
      userInfo.postcode = "123456";
      userInfo.isEmailUpdates = true;
      userInfo.isAcceptTerms = true;
      [err, user] = await to(User.findOne({ twitterid: userInfo.twitterid }));
      if (Boolean(user)) TE("Twitter id already exits");
    }
    if (userInfo.pintrestid) {
      userInfo.password = "123";
      userInfo.postcode = "123456";
      userInfo.email = "defaultid@email.com";
      userInfo.isEmailUpdates = true;
      userInfo.isAcceptTerms = true;
      [err, user] = await to(User.findOne({ pintrestid: userInfo.pintrestid }));
      if (Boolean(user)) TE("Pintrest id already exits");
    }
    if (userInfo.instaid) {
      userInfo.password = "123";
      userInfo.postcode = "123456";
      userInfo.email = "defaultid@email.com";
      userInfo.isEmailUpdates = true;
      userInfo.isAcceptTerms = true;
      [err, user] = await to(User.findOne({ instaid: userInfo.instaid }));
      if (Boolean(user)) TE("Intstagram id already exits");
    }
  } else {
    let validationError = "";
    if (userInfo.email != "") {
      //console.log(userInfo);
      if (validator.isEmail(userInfo.email)) {
        auth_info.method = "email";
        //userInfo.email = unique_key;
        [err, user] = await to(User.findOne({ email: userInfo.email }));
        //console.log(JSON.stringify(user));
        if (Boolean(user)) TE("Email id already exits");
      } else {
        TE("wrong emailid format");
      }
    }

    if (userInfo.phone != "") {
      //checks if only phone number was sent
      //console.log("ddd"+userInfo.phone);
      if (validator.isMobilePhone(userInfo.phone, "any")) {
        auth_info.method = "phone";
        console.log("kdkdk");
        [err, user] = await to(User.findOne({ phone: userInfo.phone }));
        if (err) TE(err.message);
        if (Boolean(user)) TE("Phone number already exits");
      } else {
        TE("wrong phone format");
      }
      //[err, user] = await to(User.create(userInfo));
      //if(err) TE('user already exists' +JSON.stringify(err));

      //return user;
    }
  }
  // if (!userInfo.userType) {
  //   userInfo.userType = "";
  // }
  //console.log(userInfo);
  userInfo.status = true;

  [err, user] = await to(User.create(userInfo));
  if (err) TE("Invalid Parameter" + JSON.stringify(err));

  return user;
};
module.exports.createUser = createUser;

const authUser = async function(userInfo) {
  //returns token

  let unique_key;
  let auth_info = {};
  auth_info.status = "login";
  unique_key = getUniqueKeyFromBody(userInfo);

  if (!unique_key)
    TE("Please enter an email or phone number or social media to login");

  if ((userInfo.email || userInfo.phone) && !userInfo.password)
    TE("Please enter a password to login");

  let user, emailphone;
  if (userInfo.email != "" && userInfo.email != undefined) {
    console.log("email" + userInfo.email);
    if (validator.isEmail(userInfo.email)) {
      auth_info.method = "email";
      emailphone = 1;
      [err, user] = await to(User.findOne({ email: unique_key }));
      if (err) TE(err.message);
    }
  } else if (userInfo.phone != "" && userInfo.phone != undefined) {
    //checks if only phone number was sent
    console.log("phone");
    if (validator.isMobilePhone(userInfo.phone, "any")) {
      auth_info.method = "phone";
      emailphone = 1;

      [err, user] = await to(User.findOne({ phone: userInfo.phone }));

      if (err) TE(err.message);
    }
  } else if (userInfo.fbid) {
    console.log("fbid");
    [err, user] = await to(User.findOne({ fbid: userInfo.fbid }));
    if (err) TE(err.message);
  } else if (userInfo.twitterid) {
    [err, user] = await to(User.findOne({ twitterid: userInfo.twitterid }));
    if (err) TE(err.message);
  } else if (userInfo.pintrestid) {
    [err, user] = await to(User.findOne({ pintrestid: userInfo.pintrestid }));
    if (err) TE(err.message);
  } else if (userInfo.instaid) {
    [err, user] = await to(User.findOne({ instaid: userInfo.instaid }));
    if (err) TE(err.message);
  } else {
    TE("A valid email or phone number or social media was not entered");
  }

  if (!user) TE("Not registered");

  if (emailphone) {
    [err, user] = await to(user.comparePassword(userInfo.password));
  }

  if (err) TE(err.message);
  if (userInfo.deviceToken) {
    [err, user] = await to(
      User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { deviceToken: userInfo.deviceToken }
        },
        { new: true }
      )
    );
  }

  return user;
};
module.exports.authUser = authUser;
