module.exports = {
  me: async function(req, res) {
    let user = await User.findOne({
      username: req.username
    }).populate('stats').intercept(() => 'unauthorized');

    res.json({user: user});
  },

  updatePassword: async function(req, res) {
    let username = req.username;
    let oldPassword = req.param('password');
    let newPassword = req.param('newPassword');
    let newPasswrodRepeat = req.param('newPasswordRepeat');

    if (!username || !oldPassword || !newPassword || !newPasswrodRepeat) {
      return res.badRequest("Mandatory parameter missing.");
    }

    if (newPassword === oldPassword) {
      return res.badRequest("New password is the same as old");
    }

    if (newPasswrodRepeat !== newPassword) {
      return res.badRequest("New passwords do not match");
    }
    await User.update({username: username}).set({password : newPassword});
    return res.ok();
  }
};
