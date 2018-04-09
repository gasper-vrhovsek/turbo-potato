/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    username: {
      required: true,
      type: 'string',
      unique: true,
      minLength: 3
    },
    password: {
      required: true,
      type: 'string',
      minLength: 8
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    stats: {
      collection: 'userstats',
      via: 'user'
    }

    // TODO customToJson
  },

  beforeCreate: function (data, cb) {
    bcrypt.hash(data.password, sails.config.session.salt, function (err, hash) {
      data.password = hash;
      cb();
    });
  },

  beforeUpdate: function (data, cb) {
    if (data.password) {
      bcrypt.hash(data.password, sails.config.session.salt, function (err, hash) {
        data.password = hash;
        cb();
      });
    } else {
      return cb();
    }
  },

  validPassword: function (password, user, callback) {
    bcrypt.compare(password, user.password, function (error, match) {
      if (error) {
        callback(error);
      }

      callback(null, match);
    });
  }
};
