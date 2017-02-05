import moduleConfig from './moduleconfig';

//TODO - create config
exports.config = {
  LIKE_PAGE_SIZE: 20
};

exports.name = 'Like';
exports.model = require('./model');
exports.routes = require('./routes');
exports.module = moduleConfig.publishModule;