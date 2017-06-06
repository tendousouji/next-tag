import async from 'async';
import Crawler from 'crawler';

exports.name = 'LazadaData';
exports.module = (kernel) => {
  var delay = 1000 * 60;
  var store = kernel.redisClient;

  var crawler = new Crawler({
    maxConnections: 30,
    rateLimit: 1000,
    callback: function(err, resp, done) {
      if(err) { return console.log(err); }

      var $ = resp.$;
      var lazadaUrl = 'http://www.lazada.vn';

      var store = kernel.redisClient;
      var ES = kernel.ES;

      var absoluteLinks = $("a[href^='http']");
      var relativeLinks = $("a[href^='/']");

      var name = $('#prod_title').text();
      if(name) {
        // console.log('=============================');
        // console.log(name);
        // console.log($('#productImageBox').children('.productImage').children('meta').attr('content'));
        // console.log($('.wishlist-add').attr('data-config-sku'));
        // console.log($('#special_price_box').text());
        // console.log($('#price_box').text());
        // console.log($('#product_saving_percentage').text());
        // console.log($('link[rel="canonical"]').attr('href'));
        // console.log($('.prod_details').text());
        var productId = $('.wishlist-add').attr('data-config-sku');
        var productLink = $('link[rel="canonical"]').attr('href');
        var productName = name;
        var price = $('#special_price_box').text();
        var discount = $('#product_saving_percentage').text();
        var originPrice = $('#price_box').text();
        var image = $('#productImageBox').children('.productImage').children('meta').attr('content');
        var description = $('.prod_details').text();

        let productQuery = {
          query: {
            match: {
              productId: productId
            }
          } 
        }

        let productData = {
          productId: productId,
          productLink: productLink,
          productName: productName,
          price: price,
          discount: discount,
          originPrice: originPrice,
          image: image,
          description: description,
          website: 'http://www.lazada.vn/'
        }

        ES.search(productQuery, 'products', (err, resp) => {
          if(err) {
            if(err.status == 404) {
              ES.create({
                type : 'products',
                id: productId,
                data : productData
              }, (err, resp) => {
                if(err) { return console.log(err); }
                console.log(resp);
              });
            }
          }
          // console.log(resp);
          if(resp.items.length == 0) {
            ES.create({
              type : 'products',
              id: productId,
              data : productData
            }, (err, resp) => {
              if(err) { return console.log(err); }
              console.log(resp);
            });
          }
        });

      }

      store.smembers('lazadaLinks', (err, pages) => {
        for (var i = 0; i < absoluteLinks.length; ++i) {
          var link = absoluteLinks[i].attribs.href;
          if(pages.indexOf(link) == -1) {
            if(link.includes(lazadaUrl)) {
              pages.push(link);
            }
          }
        }
        for (var j = 0; j < relativeLinks.length; ++j) {
          var link = relativeLinks[j].attribs.href;
          var fullLink = lazadaUrl+link;
          if(pages.indexOf(fullLink) == -1) {
            pages.push(fullLink);
          }
        }
        store.sadd('lazadaLinks', pages);
      });

      done();
    }
  });

  async.forever((next) => {
    console.log('LazadaCrawler');
    store.smembers('lazadaLinks', (err, pages) => {
      console.log(pages.length);
      // kernel.module.Crawler.queue(pages);
      crawler.queue(pages);
    });

    setTimeout(() => {
      next();
    }, delay);

  }, (err) => {});
}
