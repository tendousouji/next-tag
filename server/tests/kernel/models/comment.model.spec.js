'use strict';

import CommentModel from './models';
var comment;
var genComment = function() {
  comment = new CommentModel({
    objectId: 'abc',
    objectName: 'photo',
    content: 'chat chat chat',
    user: '1111',
  });
  return comment;
};

describe('Comment Model', function() {
  before(function() {
    // Clear users before testing
    return CommentModel.remove();
  });

  beforeEach(function() {
    genComment();
  });

  afterEach(function() {
    return CommentModel.remove();
  });

  describe('#content', function() {
    it('should fail when saving with a blank content', function() {
      comment.content = '';
      return comment.save().should.be.rejected;
    });

    it('should fail when saving with a null content', function() {
      comment.content = null;
      return comment.save().should.be.rejected;
    });

    it('should fail when saving without an content', function() {
      comment.content = undefined;
      return comment.save().should.be.rejected;
    });
  });
});