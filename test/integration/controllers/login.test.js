var supertest = require('supertest');
var assert = require('chai').assert;

describe('login', function () {
  let users = {};

  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
    //
    // Create users
    users.user1 = await User.create({
      username: 'test1',
      password: 'password1234'
    }).fetch();
  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
  });

  describe('#login() with wrong password', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .put('/login')
        .send({
          username: 'test1',
          password: 'wrong_password'
        })
        .expect(401, done);
    })
  });

  describe('#login() with correct password', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .put('/login')
        .send({
          username: 'test1',
          password: 'password1234'
        })
        .expect(200)
        .end(function (err, res) {
          assert.isNotNull(res.body, 'response body should not be null');
          assert.isNotNull(res.body.token, 'response body should contain a token');
          assert.isNotNull(res.body.user, 'response body should contain the username');
          assert.equal(res.body.user, users.user1.username, 'response body username should equal username of logged in user');

          done();
        });
    })
  });
});
