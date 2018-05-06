var supertest = require('supertest');
var assert = require('chai').assert;

describe('UserController.likeUser', function () {
  let users = {};

  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});

    // Create users
    users.user1 = await User.create({
      username: 'test1',
      password: 'password1234'
    }).fetch();

    users.user2 = await User.create({
      username: 'test2',
      password: 'password1234'
    }).fetch();

  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
  });

  describe('#likeUser() as unauthorized', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .put('/user/' + users.user2.id + '/like')
        .expect(401, done);
    })
  });

  describe('#likeUser() as authorized', function () {
    let auth = {};
    before(loginUser(auth));

    it('should return ok and like user', function (done) {
      supertest(sails.hooks.http.app)
        .put('/user/' + users.user2.id + '/like')
        .set({'x-token': auth.token})
        .expect(200)
        .end(async function (err, res) {

          let likes = await Like.find({});

          assert.isArray(likes, "likes query should return array");
          assert.equal(likes.length, 1, "likes query should return array of length 1");

          assert.equal(likes[0].user, users.user2.id, "like should contain correct user id");
          assert.equal(likes[0].liker, users.user1.id, "like should contain correct liker id");

          assert.equal(likes[0].id, users.user2.id + ":" + users.user1.id, "like should contain correctly generated id");
          done();
        });
    });
  });
});

describe('UserController.unlikeUser', function () {
  let users = {};

  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});

    // Create users
    users.user1 = await User.create({
      username: 'test1',
      password: 'password1234'
    }).fetch();

    users.user2 = await User.create({
      username: 'test2',
      password: 'password1234'
    }).fetch();

    await Like.create({
      id: users.user2.id + ":" + users.user1.id,
      user: users.user2.id,
      liker: users.user1.id
    });

    await UserStats.update({user: users.user2.id}).set({likes: 1});

  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
  });

  describe('#unlikeUser() as unauthorized', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .put('/user/' + users.user2.id + '/like')
        .expect(401, done);
    })
  });

  describe('#likeUser() as authorized', function () {
    let auth = {};
    before(loginUser(auth));

    it('should return ok and like user', function (done) {
      supertest(sails.hooks.http.app)
        .put('/user/' + users.user2.id + '/unlike')
        .set({'x-token': auth.token})
        .expect(200)
        .end(async function (err, res) {

          let likes = await Like.find({});

          assert.isArray(likes, "likes query should return array");
          assert.equal(likes.length, 0, "likes query should return array of length 1");
          done();
        });
    });
  });
});

function loginUser(auth) {
  return function (done) {
    supertest(sails.hooks.http.app)
      .put('/login')
      .send({
        username: 'test1',
        password: 'password1234'
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      auth.token = res.body.token;
      return done();
    }
  }
}
