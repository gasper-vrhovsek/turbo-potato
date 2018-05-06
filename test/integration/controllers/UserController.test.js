var supertest = require('supertest');
var assert = require('chai').assert;

describe('UserController.getUser on empty DB', function () {
  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
  });

  describe('#getUser()', function () {
    it('should return 404 not found', function (done) {
      supertest(sails.hooks.http.app)
        .get('/user/1')
        .expect(404, done);
    })
  });
});

describe('UserController.getUser on populated DB', function () {
  let userID;
  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});

    let user = await User.create({
      username: 'test',
      password: 'password1234'
    }).fetch();

    userID = user.id;
  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
  });

  describe('#getUser()', function () {
    it('should return correct user', function (done) {
      supertest(sails.hooks.http.app)
        .get('/user/' + userID)
        .expect(200)
        .end(function (err, res) {
          assert.isNotNull(res.body.user, "res.body.user should not be null");
          assert.isNotNull(res.body.user.id, "res.body.user.id should not be null");
          assert.isNotNull(res.body.user.username, "res.body.user.username should not be null");
          assert.isNotNull(res.body.user.stats, "res.body.user.stats should not be null");
          assert.isNotNull(res.body.user.updatedAt, "res.body.user.updatedAt should not be null");
          assert.isNotNull(res.body.user.createdAt, "res.body.user.createdAt should not be null");

          assert.strictEqual(res.body.user.id, userID);
          assert.strictEqual(res.body.user.username, 'test');
          done();
        });

    })
  });
});

describe('UserController.getMostLiked on empty DB', function () {
  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});
  });

  describe('#getMostLiked()', function () {
    it('should return empty object', function (done) {
      supertest(sails.hooks.http.app)
        .get('/most-liked')
        .expect(200)
        .end(function (err, res) {
          assert.isNotNull(res.body, "res.body should not be null");
          assert.isNotNull(res.body.stats, "res.body.stats should not be null");

          assert.isArray(res.body.stats, "res.body,stats should be an array");
          assert.equal(res.body.stats.length, 0, "res.body.stats.length should be 0");
          done();
        });
    });
  });
});

describe('UserController.getMostLiked on populated DB', function () {
  before(async function () {
    await UserStats.destroy({});
    await User.destroy({});

    // Create 3 users
    let user1 = await User.create({
      username: 'test1',
      password: 'password1234'
    }).fetch();

    let user2 = await User.create({
      username: 'test2',
      password: 'password1234'
    }).fetch();

    let user3 = await User.create({
      username: 'test3',
      password: 'password1234'
    }).fetch();

    // Let's give them some likes
    await UserStats.update({user: user1.id}).set({likes: 10});
    await UserStats.update({user: user2.id}).set({likes: 50});
    await UserStats.update({user: user3.id}).set({likes: 11});
  });

  after(async function () {
    await UserStats.destroy({});
    await User.destroy({});
  });

  describe('#getMostLiked()', function () {
    it('should return list of objects with user stats sorted descending', function (done) {
      supertest(sails.hooks.http.app)
        .get('/most-liked')
        .expect(200)
        .end(function (err, res) {
          assert.isNotNull(res.body, "res.body should not be null");
          assert.isNotNull(res.body.stats, "res.body.stats should not be null");

          assert.isArray(res.body.stats, "res.body,stats should be an array");

          assert.equal(res.body.stats.length, 3, "res.body.stats.length should be 0");

          // check likes
          assert.equal(res.body.stats[0].likes, 50, "res.body.stats[0].likes should be 50");
          assert.equal(res.body.stats[1].likes, 11, "res.body.stats[0].likes should be 11");
          assert.equal(res.body.stats[2].likes, 10, "res.body.stats[0].likes should be 10");

          done();
        });
    });
  });
});
