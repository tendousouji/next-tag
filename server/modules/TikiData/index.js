import async from 'async';

exports.name = 'TikiData';
// exports.routes = require('./routes');
exports.module = (kernel) => {
  var delay = 1000 * 60;
  var store = kernel.redisClient;

  async.forever((next) => {

    console.log('Tiki Crawler')
    store.smembers('tikiLinks', (err, pages) => {
      console.log(pages.length);
      kernel.module.Crawler.queue(pages);
    });

    setTimeout(() => {
      next();
    }, delay);

  }, (err) => {});

}
