
var User  = require("../models/user.model");
var jwt_middleware = (req, res, next) => {
  var token = req.header("x-access-token");
  User.findByToken(token)
    .then(user => {
      if (!user) {
        Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send({
        error: "err",
        status: 401,
        message: "err"
      });
    });
};

module.exports = {
  jwt_middleware
};
