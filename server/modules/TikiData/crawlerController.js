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

    // this.kernel.module.Crawler.queue('https://tiki.vn/pin-sac-may-anh/c2662');

    return res.status(200).json('Hello World');
  }
}

module.exports = TikiCrawlerController;
