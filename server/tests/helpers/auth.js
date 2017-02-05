'use strict';

import kernel from '../../..';
import request from 'supertest';
import async from 'async';
var app = kernel.app;
var UserModel = kernel.model.User;

var userFakeLoginToken = null;
module.exports = {
  getTokenOfFakeUser(cb) {
    UserModel.remove({email: 'test@example.com'}).then(function() {
      var user = new UserModel({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    })
    .then(user => {
      request(app)
        .post('/api/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .end((err, res) => {
          if (err) { return cb(err); }
          return cb(null, res.body.token);
        });
    });
  }
};
