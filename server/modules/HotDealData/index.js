import async from 'async';

exports.name = 'HotDealData';
exports.module = (kernel) => {
  var delay = 1000 * 60;
  var store = kernel.redisClient;

  async.forever((next) => {

    console.log('HotDeal Crawler');
    store.smembers('hotDealLinks', (err, pages) => {
      console.log(pages.length);
      kernel.module.Crawler.queue(pages);
    });

    setTimeout(() => {
      next();
    }, delay)

  }, (err) => {});  

}
