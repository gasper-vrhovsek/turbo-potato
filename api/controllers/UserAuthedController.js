/**
 * Controller for all user related api endpoints which require authentication
 *
 * */

var flaverr = require('flaverr');

module.exports = {
  likeUser: async function (req, res) {
    await sails.getDatastore().transaction(async (db, proceed) => {

      let user = await User.getById(req.param('id'), db);
      if (!user) {
        let err = flaverr('E_NO_SUCH_USER', new Error('User does not exist'));
        return proceed(err);
      }

      let liker = await User.getByUsername(req.username, db);
      if (!liker) {
        let err = flaverr('E_NO_SUCH_LIKER', new Error('Liker does not exist'));
        return proceed(err);
      }

      let like = await Like.getByUserIdLikerId(user.id, liker.id, db);
      if (like) {
        let err = flaverr('E_USER_ALREADY_LIKED', new Error('This user is already liked by this liker'));
        return proceed(err);
      } else {
        like = await Like.create({
          id: user.id + ':' + liker.id,
          user: user.id,
          liker: liker.id
        }).fetch().usingConnection(db);

        if (like) {
          await UserStats.update({user: user.id}).set({likes: user.stats[0].likes + 1}).usingConnection(db);
        }
      }

      return proceed();
    }).intercept('E_NO_SUCH_USER', 'noSuchUser')
      .intercept('E_NO_SUCH_LIKER', 'noSuchLiker')
      .intercept('E_USER_ALREADY_LIKED', 'userAlreadyLiked');
    return res.ok();
  },

  unlikeUser: async function (req, res) {
    await sails.getDatastore().transaction(async (db, proceed) => {
      let user = await User.getById(req.param('id'), db);
      if (!user) {
        let err = flaverr('E_NO_SUCH_USER', new Error('User does not exist'));
        return proceed(err);
      }

      let liker = await User.getByUsername(req.username, db);
      if (!liker) {
        let err = flaverr('E_NO_SUCH_LIKER', new Error('Liker does not exist'));
        return proceed(err);
      }

      let like = await Like.getByUserIdLikerId(user.id, liker.id, db);

      await Like.destroy({id: like.id}).usingConnection(db);
      await UserStats.update({user: user.id}).set({likes: user.stats[0].likes - 1}).usingConnection(db);

      return proceed();
    })
      .intercept('E_NO_SUCH_USER', () => 'user notFound')
      .intercept('E_NO_SUCH_LIKER', () => 'liker notFound')
      .intercept('E_USER_ALREADY_LIKED', () => 'badRequest');

    return res.ok();
  },
};
