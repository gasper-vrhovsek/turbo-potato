module.exports = {
  me: async function(req, res) {
    let user = await User.findOne({
      username: req.username
    }).populate('stats').intercept(() => 'unauthorized');

    res.json({user: user});
  },

  updatePassword: function(req, res) {
    res.json({msg: 'not implemented'});
  }

};
