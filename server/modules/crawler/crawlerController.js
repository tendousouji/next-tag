'use strict';
import request from 'request';
import cheerio from 'cheerio';
import URL from 'url-parse';
import async from 'async';

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  }
}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return (bodyText.indexOf(word.toLowerCase()) != -1);
}

function crawl(url, word, baseUrl, callback) {
  var pages = []
  request(url, (error, response, body) => {
    if(error) {
      // handleError(error);
      return callback(error, []);
    }

    if(response.statusCode == 200) {

      var $ = cheerio.load(body);

      // if(searchForWord($, word)) {
      //   console.log('Word ' + word + ' found at page: ' + url);
      // } else {

      // }

      var productArray = $('.product-item   ');
      console.log(productArray.length);
      for (var k = 1; k <= productArray.length; ++k) {
        // console.log($('.product-item:nth-child(' + k + ')').parent().attr('class'));
        if($('.product-item:nth-child(' + k + ')').parent().attr('class') == 'product-box-list') {
          console.log('----------------------------------------------------------------------');
          console.log($('.product-item:nth-child(' + k + ')').children().attr('href'));
          console.log($('.product-item:nth-child(' + k + ')').children().attr('title'));
          console.log($('.product-item:nth-child(' + k + ')').children().children('.price-sale').text());

          var length = $('.product-item:nth-child(' + k + ')').children().children('.image').children('img').length;
          if(length > 1) {
            console.log($('.product-item:nth-child(' + k + ')').children().children('.image').children('img:nth-child(2)').attr('src'));
          } else {
            console.log($('.product-item:nth-child(' + k + ')').children().children('.image').children('img').attr('src'));
          }

          console.log($('.product-item:nth-child(' + k + ')').children().children('.review').text());
        }
      }

      // console.log('----------------------------------------------------------------------');
      // console.log($('.product-item   ').first().children().attr('href'));
      // console.log($('.product-item   ').first().children().children('.title').text());
      // console.log($('.product-item   ').first().children().children('.price-sale').text());

      // if($('.product-item   ').first().children().children('.image').children('img').hasClass('lazy')) {
      //   console.log($('.product-item   ').first().children().children('.image').children('img').attr('data-src'));
      // } else {
      //   console.log($('.product-item   ').first().children().children('.image').children('img').attr('src'));
      // }

      // console.log($('.product-item   ').first().children().children('.review').text());
      
      var absoluteLinks = $("a[href^='http']");
      var relativeLinks = $("a[href^='/']");

      for (var i = 0; i < absoluteLinks.length; ++i) {
        var link = absoluteLinks[i].attribs.href;
        if(pages.indexOf(link) == -1) {
          if(link.includes(baseUrl)) {
            pages.push(link);
          }
        }
      }

      for (var j = 0; j < relativeLinks.length; ++j) {
        var link = relativeLinks[j].attribs.href;
        var fullLink = baseUrl+link;
        if(pages.indexOf(fullLink) == -1) {
          pages.push(fullLink);
        }
      }

      return callback(null, pages);

    }
  });
}

// function collectInternalLinks($) {
//   var absoluteLinks = $("a[href^='http']");
//   var relativeLinks = $("a[href^='/']");
  
//   absoluteLinks.each(() => {
//     pagesToVist.push($(this).attr('href'));
//   });

//   relativeLinks.each(() => {
//     pagesToVist.push(baseUrl + $(this).attr('href'));
//   });

//   console.log(pagesToVist.length);
// }

class CrawlerController {
  constructor(kernel) {
    this.kernel = kernel;

    this.index = this.index.bind(this);
  }

  index(req, res) {

    let store = this.kernel.redisClient;
    let startUrl = 'https://tiki.vn/';
    let url = new URL(startUrl);
    let baseUrl = url.protocol + '//' + url.hostname;
    // console.log(baseUrl);
    let pagesToVist = [];
    let pageVisted = [];
    let searchWord = 'Ngày Xưa Có Một Chuyện Tình';

    // pagesToVist.push(startUrl);
    pagesToVist.push(startUrl);

    crawl(startUrl, searchWord, baseUrl, (err, pages) => {
      if(err) { return console.log(err); }
      store.sadd('links', pages);
    });
    
    store.smembers('links', (err, pages) => {
      console.log(pages.length);

      if(pages.length > 0) {
        // var count = 0;
        // var temps = pages.slice(0, 1);
        var temps = ['https://tiki.vn/pin-sac-may-anh/c2662'];
        // var limit = Math.floor(pages.length/8);
        // console.log(limit);

        async.mapLimit(temps, 10, (link, callback) => {
          // ++count;
          console.log(link);
          crawl(link, searchWord, baseUrl, (error, newPages) => {
            if(error) {
              return callback(null, []);
            } else {
              // console.log(count);
              return callback(null, newPages.length);
            }
          });
        }, (err, response) => {
          if(err) { return console.log(err); }
          console.log(response);
        });

      }

    });

    store.flushdb((err, response) => {
      console.log(response);
    });

    // console.log(pagesToVist.length);

    return res.status(200).json('Hello World');
  }
}

module.exports = CrawlerController;
