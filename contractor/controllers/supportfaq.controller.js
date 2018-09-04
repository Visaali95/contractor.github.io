const supportFAQ = require("../models/supportfaq.model");
const { ReE, ReS } = require("../services/util.service");
const _ = require("lodash");

const create = (req, res) => {
  var supportFAQSave = new supportFAQ(req.body);
  supportFAQSave
    .save()
    .then(faqs => {
      return ReS(res, { message: "Updated Successfully", faqs: faqs });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.create = create;
const fetch = (req, res) => {
  return supportFAQ
    .find({})
    .then(faqs => {
      return ReS(res, {
        message: "FAQS",
        faqs: faqs
      });
    })
    .catch(e => {
      return ReE(res, e, 422);
    });
};
module.exports.fetch = fetch;
