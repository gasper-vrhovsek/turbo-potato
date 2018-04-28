/**
 * Login controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Login controller',
  description: 'Login and receive JWT',

  inputs: {
    username: {
      required: true,
      type: 'string',
      description: 'Username',

    },
    password: {
      required: true,
      type: 'string',
      description: 'Password'
    }
  },

  exits: {
    unauthorized: {
      statusCode: 401,
      description: 'Unauthorized'
    },
  },

  fn: async function (inputs, exits) {
    let user = await User.findOne({
      username: inputs.username
    }).intercept(() => 'unauthorized');

    const password = inputs.password;
    User.validPassword(password, user, function (err, valid) {
      if (!err && valid) {
        console.log("Pass valid!");
        let token = jwt.sign(
          {
            'sub': 'iamatoken',
            'username': user.username,
          }, sails.config.session.secret, {expiresIn: "5m"});
        return exits.success({success: true, token: token, user: user.username});
      }
      return exits.unauthorized()
    });
  }
};

