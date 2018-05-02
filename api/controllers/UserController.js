module.exports = {
  getUser: async function(req, res) {
    let id = req.param('id');
    let user = await User.findOne({
      id: id
    }).populate('stats').intercept(() => 'unauthorized');
    res.json({user: user});
  },

  getMostLiked: async function(req, res) {
    let allStats = await UserStats.find({
      sort: 'likes DESC'
    }).populate('user');

    return res.status(500).json({stats: allStats});
  }
};
