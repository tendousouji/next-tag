'use strict';

import kernel from '../../..';
import request from 'supertest';
var app = kernel.app;
import CommentModel from './models';

describe('Comment API:', function() {
  var comment;
  var mongoose = require('mongoose');
  // Clear comments before testing
  before(function() {
    return CommentModel.remove().then(function() {
      comment = new CommentModel({
        objectId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
        objectName: 'photo',
        content: 'chat chat chat',
        user: '1111',
      });
      return comment.save();
    });
  });

  // Clear comments after testing
  after(function() {
    return CommentModel.remove();
  });

  // Create new comment
  describe('POST /api/v1/comments', function() {
  it('should respond with a new comment', function(done) {
      request(app)
        .post('/api/v1/comments')
        .send({
          objectId: '4edd40c86762e0fb12000005',
          objectName: 'photo',
          content: 'chat chat chat',
          user: '1111',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });
  });

  // Get list comment by objectId and objectName
  describe('GET /api/v1/comments', function() {

    it('should respond with get list comments', function(done) {
      request(app)
        .get('/api/v1/comments/4edd40c86762e0fb12000005/photo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });
  });

});
