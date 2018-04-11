var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  const token = req.headers["x-token"];

  if(!token)
    res.send(401, {error: "AUTH_REQUIRED", message: "Authentication required"});

  //TODO check token in header
  let valid = jwt.verify(token, sails.config.session.secret);

  if (!valid)
    res.send(401, {error: "TOKEN_INVALID", message: "Token is invalid"});

  return next();
};
