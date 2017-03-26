'use strict';
import request from 'request';
import cheerio from 'cheerio';
import URL from 'url-parse';
import async from 'async';
import fs from 'fs';

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
      return callback(error, []);
    }

    if(response.statusCode == 200) {

      var $ = cheerio.load(body);

      var productArray = $('.product-item   ');
      // console.log(productArray.length);
      for (var k = 1; k <= productArray.length; ++k) {
        if($('.product-item:nth-child(' + k + ')').parent().attr('class') == 'product-box-list') {

          // --------------------------Write data to file--------------------------
          var id = $('.product-item:nth-child(' + k + ')').attr('data-id');
          var link = $('.product-item:nth-child(' + k + ')').children().attr('href');
          var category = $('.product-item:nth-child(' + k + ')').attr('data-category').replace('(not set)/', '');
          var product = $('.product-item:nth-child(' + k + ')').children().attr('title');
          var price = $('.product-item:nth-child(' + k + ')').children().children('.price-sale').clone().children().remove().end().text().replace(/\s/g,'');
          var discount = $('.product-item:nth-child(' + k + ')').children().children('.price-sale').children('.sale-tag').text();
          var oldPrice = $('.product-item:nth-child(' + k + ')').children().children('.price-sale').children('.price-regular').text();
          var review = $('.product-item:nth-child(' + k + ')').children().children('.review').text();
          var length = $('.product-item:nth-child(' + k + ')').children().children('.image').children('img').length;
          if(length > 1) {
            var image = $('.product-item:nth-child(' + k + ')').children().children('.image').children('img:nth-child(2)').attr('src');
          } else {
            var image = $('.product-item:nth-child(' + k + ')').children().children('.image').children('img').attr('src');
          }
          fs.appendFileSync('tiki.txt', '---------------------------\n' + 'Id: ' + id + '\n' + 'Link: ' + link +  '\n' 
            + 'Category: ' + category + '\n' + 'Product: ' + product + '\n' + 'Price: ' + price + '\n' + 'Discount: ' + discount + '\n' 
            + 'Original Price: ' + oldPrice + '\n' + 'Image: ' + image + '\n' + 'Review: ' + review + '\n' );
        }
      }

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

    } else {
      return callback(null, pages);
    }
  });
}

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

        console.log(Math.floor(pages.length/5));
        var splitArray = []
        var limit = Math.floor(pages.length/5);
        var start = 0;
        var end = limit;

        for (var t = 0; t < 5; ++t) {
          var temps = pages.slice(start, end);
          if(temps.length > 0) {
            splitArray.push(temps);
          } else {
            splitArray.push([]);
          }
          start = end;
          end += limit;
        }

        // for (var t = 0; t < 5; ++t) {
        //   console.log(splitArray[t].length);
        // }

        var temps = ['https://tiki.vn/pin-sac-may-anh/c2662'];
        async.mapLimit(temps, 10, (link, callback) => {
          crawl(link, searchWord, baseUrl, (error, newPages) => {
            if(error) {
              return callback(null, 0);
            } else {
              return callback(null, newPages.length);
            }
          });
        }, (err, resp) => {
          if(err) { return console.log(err); }
          console.log(resp);
        });
        /*
        async.waterfall([
          (cb) => {
            let resutlArray = []
            async.mapLimit(splitArray[0], 10, (link, callback) => {
              crawl(link, searchWord, baseUrl, (error, newPages) => {
                if(error) {
                  return callback(null, []);
                } else {
                  return callback(null, newPages);
                }
              });
            }, (err, resp) => {
              if(err) { return console.log(err); }
              // console.log(resp);
              for (var t = 0; t < resp.length; ++t) {
                for (var l = 0; l < resp[t].length; ++l) {
                  if(resutlArray.indexOf(resp[t][l]) == -1) {
                    resutlArray.push(resp[t][l]);
                  }
                }
              }
              return cb(null, resutlArray);
            });
          },
          (arg1, cb) => {
            let resutlArray = arg1;
            async.mapLimit(splitArray[1], 10, (link, callback) => {
              crawl(link, searchWord, baseUrl, (error, newPages) => {
                if(error) {
                  return callback(null, []);
                } else {
                  return callback(null, newPages);
                }
              });
            }, (err, resp) => {
              if(err) { return console.log(err); }
              for (var t = 0; t < resp.length; ++t) {
                if(resutlArray.indexOf(resp[t]) == -1) {
                  resutlArray.push(resp[t]);
                }
              }
              return cb(null, resutlArray);
            });
          },
          (arg1, cb) => {
            let resutlArray = arg1;
            async.mapLimit(splitArray[2], 10, (link, callback) => {
              crawl(link, searchWord, baseUrl, (error, newPages) => {
                if(error) {
                  return callback(null, []);
                } else {
                  return callback(null, newPages);
                }
              });
            }, (err, resp) => {
              if(err) { return console.log(err); }
              for (var t = 0; t < resp.length; ++t) {
                for (var l = 0; l < resp[t].length; ++l) {
                  if(resutlArray.indexOf(resp[t][l]) == -1) {
                    resutlArray.push(resp[t][l]);
                  }
                }
              }
              return cb(null, resutlArray);
            });
          },
          (arg1, cb) => {
            let resutlArray = arg1;
            async.mapLimit(splitArray[3], 10, (link, callback) => {
              crawl(link, searchWord, baseUrl, (error, newPages) => {
                if(error) {
                  return callback(null, []);
                } else {
                  return callback(null, newPages);
                }
              });
            }, (err, resp) => {
              if(err) { return console.log(err); }
              for (var t = 0; t < resp.length; ++t) {
                for (var l = 0; l < resp[t].length; ++l) {
                  if(resutlArray.indexOf(resp[t][l]) == -1) {
                    resutlArray.push(resp[t][l]);
                  }
                }
              }
              return cb(null, resutlArray);
            });
          },
          (arg1, cb) => {
            let resutlArray = arg1;
            async.mapLimit(splitArray[4], 10, (link, callback) => {
              crawl(link, searchWord, baseUrl, (error, newPages) => {
                if(error) {
                  return callback(null, []);
                } else {
                  return callback(null, newPages);
                }
              });
            }, (err, resp) => {
              if(err) { return console.log(err); }
              for (var t = 0; t < resp.length; ++t) {
                for (var l = 0; l < resp[t].length; ++l) {
                  if(resutlArray.indexOf(resp[t][l]) == -1) {
                    resutlArray.push(resp[t][l]);
                  }
                }
              }
              return cb(null, resutlArray);
            });
          }
        ], (err, result) => {
          if(err) { return console.log(err); }
          console.log(result.length);
        });
        */

      }

    });

    store.flushdb((err, response) => {
      console.log(response);
    });

    return res.status(200).json('Hello World');
  }
}

module.exports = CrawlerController;
