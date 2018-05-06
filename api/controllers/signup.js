/**
 * Signup action
 */

module.exports = {
  friendlyName: 'Signup controller',
  description: 'Signup for a new user account',

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
    usernameAlreadyInUse: {
      statusCode: 400,
      description: 'Username already taken'
    }
  },

  fn: async function (inputs, exits) {
    const newUsername = inputs.username;
    const password = inputs.password;

    const newUser = await User.create({
      username: newUsername,
      password: password
    }).intercept("E_UNIQUE", ()=>"usernameAlreadyInUse").fetch();

    return exits.success(newUser);
  }
};

