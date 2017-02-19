import  CrawlerController from './crawlerController';

module.exports = (kernel) => {

  let crawlerController = new CrawlerController(kernel);

  kernel.app.get('/api/v1/crawler', crawlerController.index);

}