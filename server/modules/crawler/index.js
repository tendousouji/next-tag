import Crawler from 'crawler';

exports.name = 'Crawler'
exports.module = (kernel) => {
  
  var crawler = new Crawler({
    maxConnections: 10,
    callback: function(err, resp, done) {
      if(err) { return console.log(err); }

      var $ = resp.$;
      console.log($("title").text());

      done();
    }
  });

  return {
    queue(urls) {
      crawler.queue(urls);      
    }
  }
};
