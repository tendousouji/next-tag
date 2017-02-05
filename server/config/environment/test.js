'use strict';

import path from 'path';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  MONGO_URL: 'mongodb://localhost/meanstack-dev',
  MONGO_REPLICAS_NUMBER: null,
  HTTP_PORT: 9000,
  PUBLIC_PATHS: [
    path.resolve('./.tmp'),
    path.resolve('./client')
  ],

  REDIS: {
    port: 6379,
    host: '127.0.0.1',
    db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  },
  SECRETS: {
    session: 'app-secret'
  },
  REST_PREFIX: '/api/v1/',

  QUEUE_NAME: 'mean',
  QUEUE_CONFIG: {
    prefix: 'q',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      options: {}
    }
  }
};
