var jwt = require('express-jwt');

module.exports = function (req, res, next) {

  const token = req.headers["x-token"];

  if(!token)
    res.send(401, {error: "AUTH_REQUIRED", message: "Authentication required"});

  sails.helpers.verifyToken
};
