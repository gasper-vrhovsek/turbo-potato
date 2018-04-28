var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log("Checking auth");

  const token = req.headers["x-token"];
  if (!token)
    return res.status(401).send({error: "AUTH_REQUIRED", message: "Authentication required"});

  jwt.verify(token, sails.config.session.secret, function (err, data) {
    if (err)
      return res.status(401).send({error: "TOKEN_INVALID", message: "Token is invalid"});

    req.username = data.username;
    return next();
  });
};
