var supertest = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('MeController.ne', function () {
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

  describe('#me() as unauthorized', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .get('/me/')
        .expect(401, done);
    })
  });

  describe('#me() as authorized', function () {
    let auth = {};
    before(loginUser(auth));

    it('should return ok show my data', function (done) {
      supertest(sails.hooks.http.app)
        .get('/me/')
        .set({'x-token': auth.token})
        .expect(200)
        .end(async function (err, res) {
          assert.isNotNull(res.body.user, 'response should contain user object');
          assert.equal(res.body.user.id, users.user1.id, 'user id should match logged in user id');
          assert.equal(res.body.user.username, users.user1.username, 'username should match logged in username');
          assert.isNotNull(res.body.user.stats, 'users stats should not be null');
          done();
        });
    });
  });
});

describe('MeController.updatePassword', function () {
  let users = {};
  let oldPassword = 'password1234';
  let newPassword = 'password4321';

  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});

    // Create users
    users.user1 = await User.create({
      username: 'test1',
      password: oldPassword
    }).fetch();

    console.log('Old password = ' + users.user1.password);
  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
  });

  describe('#updatePassword() as unauthorized', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .post('/me/update-password')
        .expect(401, done);
    })
  });

  describe('#updatePassword() as authorized', function () {
    let auth = {};
    before(loginUser(auth));

    it('should return ok and change users password', function (done) {
      supertest(sails.hooks.http.app)
        .post('/me/update-password')
        .set({'x-token': auth.token})
        .send({
          password: oldPassword,
          newPassword: newPassword,
          newPasswordRepeat: newPassword
        })
        .expect(200)
        .end(async function (err, res) {
          if (err) {
            done(err);
          }
          let user = await User.findOne({id: users.user1.id});
          User.validPassword(newPassword, user, function (err, match) {
            assert.isNull(err, 'Error should be null');
            assert.isNotNull(match, 'match should not be null');
            assert.isTrue(match, 'match should be true');
            console.log("Match = " + match);
          });
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
