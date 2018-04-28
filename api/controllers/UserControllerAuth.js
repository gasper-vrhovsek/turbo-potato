module.exports = {
  likeUser: async function(req, res) {
    console.log("likeUser");



    let user = await User.findOne({
      id: req.param('id')
    }).populate('stats').intercept(() => 'unauthorized');

    console.log("user = " + user);
    console.log("req username = " + req.username);


    let liker = await User.findOne({
      username: req.username
    }).populate('stats').intercept(() => 'unauthorized');

    console.log("liker = " + liker);

    const like = await Like.create({
      id: user.id + ':' + liker.id,
      user: user.id,
      liker: liker.id
    }).fetch();

    res.json({like: like});
  },

  unlikeUser: function(req, res) {
    res.json({msg: 'not implemented'});
  },

};
