const keyPublishable = "pk_test_wa7eDXkd2ZhojTyzNHQ1epk7";
const keySecret = "sk_test_AtgHQGrxpvffnRPv5GqoG6Pm";
const stripe = require("stripe")(keySecret);
exports.payment = (req, res, next) => {
  let amount = 5 * 100; // 500 cents means $5

  stripe.customers
    .create({
      email: req.body.stripeEmail
    })
    .then(function(customer) {
      return stripe.customers.createSource(customer.id, {
        source: req.body.stripeToken
      });
    })
    .then(function(source) {
      return stripe.charges.create({
        amount: amount,
        currency: "usd",
        customer: source.customer
      });
    })
    .then(function(charge) {
      res.status(200).json({
        status: 200,
        message: "payment successfully"
      });
    })
    .catch(e => {
      res.status(400).send({ status: 400, message: e.message });
    });
};
