import TikiCrawlerController from './crawlerController';

module.exports = (kernel) => {

  let tikiCrawlerController = new TikiCrawlerController(kernel);

  kernel.app.get('/api/v1/tikicrawler', tikiCrawlerController.index);

}