import redis from 'redis';

exports.config = {
  REDIS: {
    port: 6379,
    host: '127.0.0.1',
    db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
};

exports.core = (kernel) => {
  kernel.redisClient = redis.createClient(kernel.config.REDIS);
};