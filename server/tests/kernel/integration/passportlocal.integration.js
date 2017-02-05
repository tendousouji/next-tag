'use strict';

import kernel from '../../..';
import request from 'supertest';
var app = kernel.app;
var UserModel = kernel.model.User;

describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return UserModel.remove().then(function() {
      user = new UserModel({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return UserModel.remove();
  });

  describe('POST /api/auth/local', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/api/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should response token', function(done) {
      expect(token).to.not.equal(null);
      done();
    });
  });
});
