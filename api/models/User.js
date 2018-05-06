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
    },

  },

  customToJSON: function () {
    return _.omit(this, ['password'])
  },

  beforeCreate: function (user, callback) {
    bcrypt.hash(user.password, sails.config.session.salt, function (err, hash) {
      user.password = hash;
      callback();
    });
  },

  afterCreate: async function (user, callback) {
    await UserStats.create({
      user: user.id
    });

    callback();
  },

  beforeUpdate: function (user, callback) {
    if (user.password) {
      bcrypt.hash(user.password, sails.config.session.salt, function (err, hash) {
        user.password = hash;
        callback();
      });
    } else {
      return callback();
    }
  },

  validPassword: function (password, user, callback) {
    bcrypt.compare(password, user.password, function (error, match) {
      if (error) {
        return callback(error);
      }

      return callback(null, match);
    });
  },

  // GET METHODS

  getById: async function (id, db_conn) {
    let user;
    if (db_conn) {
      user = await User.findOne({
        id: id
      }).populate('stats').usingConnection(db_conn);
    } else {
      user = await User.findOne({
        id: id
      }).populate('stats');
    }
    return user;
  },

  getByUsername: async function (username, db_conn) {
    let user;
    if (db_conn) {
      user = await User.findOne({
        username: username
      }).populate('stats').usingConnection(db_conn);
    } else {
      user = await User.findOne({
        username: username
      }).populate('stats');
    }
    return user;
  }

};
