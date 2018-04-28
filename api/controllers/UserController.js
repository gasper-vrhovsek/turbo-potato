module.exports = {
  getUser: async function(req, res) {
    console.log("getUser");

    let id = req.param('id');

    console.log(id);
    let user = await User.findOne({
      id: id
    }).populate('stats').intercept(() => 'unauthorized');

    res.json({user: user});
  }
};
