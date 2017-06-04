'use strict';

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  }
}

class TikiCrawlerController {
  constructor(kernel) {
    this.kernel = kernel;

    this.index = this.index.bind(this);
  }

  index(req, res) {

    let store = this.kernel.redisClient;

    // store.smembers('tikiLinks', (err, pages) => {
      
    // });

    // this.kernel.module.Crawler.queue('https://tiki.vn');

    store.flushdb((err, response) => {
      console.log(response);
    });

    return res.status(200).json('Hello World');
  }
}

module.exports = TikiCrawlerController;
