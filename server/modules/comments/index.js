import moduleConfig from './moduleconfig';

exports.config = {
  COMMENT_VALIDATORS: {
    minLength: 1
  },
  COMMENT_PAGE_SIZE: 50
};

exports.name = 'Comment';
exports.model = require('./models');
exports.routes = require('./routes');
exports.module = moduleConfig.publishModule;

