const support = require("../models/support.model");
const User = require("../models/user.model");
const { ReE, ReS } = require("../services/util.service");
let nodemailer = require("nodemailer");
let sendmail = require("sendmail")((silent = true));
const create = (req, res) => {
  User.findOne({ _id: req.body.userId })
    .then(user => {
      return support
        .findOneAndUpdate(
          {
            userId: req.body.userId
          },
          {
            $set: { ques: req.body.ques }
          },
          {
            upsert: true,
            new: true
          }
        )

        .then(support => {
          sendmail(
            {
              from: `${user.email}`,
              to: "devtest7417@gmail.com",
              subject: `${support.userId}`,
              text: `${support.ques}`
            },
            function(err, reply) {
              console.log(err && err.stack);
              console.dir(reply);
              res.json({
                status: "success",
                message: "sent",
                response: "sent mail"
              });
            }
          );
        });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.create = create;
