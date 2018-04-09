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
    usernameNotFound: {
      statusCode: 404,
      description: 'Username / password does not match.'
    },
  },

  fn: async function (inputs, exits) {

    let user = await User.find({
      username: inputs.username
    }).intercept(() => 'usernameNotFound');

    const password = inputs.password;
    User.validPassword(password, user, function (err, valid) {
      if (err) {
        return exits.usernameNotFound();
      }
    });

    let token = jwt.sign(
      {
        'sub': 'iamatoken',
        'username': user.username,
      }, sails.config.session.secret, {expiresIn: "24h"});
    return exits.success({success: true, token: token, user: user.username});
  }
};

