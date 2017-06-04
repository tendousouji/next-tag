import async from 'async';

exports.name = 'LazadaData';
exports.module = (kernel) => {
  var delay = 1000 * 60;
  var store = kernel.redisClient;

  async.forever((next) => {
    console.log('LazadaCrawler');
    store.smembers('lazadaLinks', (err, pages) => {
      console.log(pages.length);
      kernel.module.Crawler.queue(pages);
    });

    setTimeout(() => {
      next();
    }, delay);

  }, (err) => {});
}
