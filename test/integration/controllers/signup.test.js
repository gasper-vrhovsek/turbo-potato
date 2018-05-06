var supertest = require('supertest');

describe('signup', function () {
  let users = {};

  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
    //
    // Create users
    users.user1 = await User.create({
      username: 'test2',
      password: 'password1234'
    }).fetch();
  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
    await Like.destroy({});
  });

  describe('#signup()', function () {
    it('should return ok', function (done) {
      supertest(sails.hooks.http.app)
        .post('/signup')
        .send({
          username: 'test1',
          password: 'password1234'
        })
        .expect(200, done);
    })
  });

  describe('#signup() with short password', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .post('/signup')
        .send({
          username: 'test1',
          password: 'pwd'
        })
        .expect(403, done);
    })
  });

  describe('#signup() with already used username', function () {
    it('should return unauthorized', function (done) {
      supertest(sails.hooks.http.app)
        .post('/signup')
        .send({
          username: 'test2',
          password: 'password1234'
        })
        .expect(403, done);
    })
  });
});
