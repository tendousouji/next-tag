'use strict';

// Set default node environment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-register');
}


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var config = require('./config/environment');

// Connect to MongoDB
mongoose.connect(config.MONGO_URL);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

module.exports = exports = require('./migrations');