const User = require('../models/user.model');
const {  ReE, ReS }  = require('../services/util.service');
let nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "devtest7417",
      pass: "devtest1234"
  }
});

const create = (req, res) => {


  User.findOneAndUpdate({
    email:req.body.email
  },
  {
    $set:{otp:"1111"}
  },
  {
    new : true
  }
).then((otpvalue)=> {
  var mailOptions={
    to : otpvalue.email,
    subject : "Contractor Connect",
    text : `your password reset code is ${otpvalue.otp}`
}
    smtpTransport.sendMail(mailOptions, function(error, response){
             console.log("Message sent: " + response);
             res.json({status:"success", message:"sent", response:'sent mail'})
          
  
  })
}).catch((e)=>{

    return ReE(res, {e:"emailid not found"}, 422);
  })

};
module.exports.create = create;
