import async from 'async';
import Crawler from 'crawler';

exports.name = 'HotDealData';
exports.module = (kernel) => {
  var delay = 1000 * 60;
  var store = kernel.redisClient;
  var crawler = new Crawler({
    maxConnections: 30,
    rateLimit: 1000,
    callback: function(err, resp, done) {
      if(err) { return console.log(err); }

      var $ = resp.$;
      var hotDealUrl = 'https://www.hotdeal.vn/ho-chi-minh';

      var store = kernel.redisClient;
      var ES = kernel.ES;

      var absoluteLinks = $("a[href^='http']");
      var relativeLinks = $("a[href^='/']");

      var name = $('.product__details').children('.product__header').children('.product__title').text();
      if(name) {
        // console.log('====================================');
        // console.log(name);
        // console.log($('link[rel="canonical"]').attr('href'));
        // console.log($('.product__description').text());
        // console.log($('._product_price_old').children('.price--list-price').children('.price__value').text());
        // console.log($('._product_price').children('.price').children('.price__value').text());
        // console.log($('._product_price').children('.price').children('.price__discount').text().replace('-', ''));
        // console.log($('.gallery__image').children('a:nth-child(1)').children('img').attr('src'));
        console.log($('.product__gallery.gallery').attr('id').replace('product-gallery-', ''));

        var productId = $('.product__gallery.gallery').attr('id').replace('product-gallery-', '');
        var productLink = $('link[rel="canonical"]').attr('href');
        var productName = name;
        var price = parseInt($('._product_price').children('.price').children('.price__value').text().replace(/\,/g, ''));
        var discount = $('._product_price').children('.price').children('.price__discount').text().replace('-', '');
        var originPrice = parseInt($('._product_price_old').children('.price--list-price').children('.price__value').text().replace(/\,/g, ''));
        var image = $('.gallery__image').children('a:nth-child(1)').children('img').attr('src');
        var description = $('.product__description').text();

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
          website: 'https://www.hotdeal.vn/ho-chi-minh/'
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
          if(resp) {
            if(resp.items.length == 0) {
              ES.create({
                type : 'products',
                id: productId,
                data : productData
              }, (err, resp) => {
                if(err) { return console.log(err); }
                console.log(resp);
              });
            } else {
              ES.update({
                type : 'products',
                id: productId,
                data : productData
              }, (err, resp) => {
                if(err) { return console.log(err); }
                // console.log(resp);
              });
            }
          }
        });

      }

      store.smembers('hotDealLinks', (err, pages) => {
        for (var i = 0; i < absoluteLinks.length; ++i) {
          var link = absoluteLinks[i].attribs.href;
          if(pages.indexOf(link) == -1) {
            if(link.includes(hotDealUrl)) {
              pages.push(link);
            }
          }
        }
        for (var j = 0; j < relativeLinks.length; ++j) {
          var link = relativeLinks[j].attribs.href;
          var fullLink = hotDealUrl+link;
          if(pages.indexOf(fullLink) == -1) {
            pages.push(fullLink);
          }
        }
        store.sadd('hotDealLinks', pages);
      });

      done();
    }
  });

  async.forever((next) => {
    console.log('HotDeal Crawler');
    store.smembers('hotDealLinks', (err, pages) => {
      console.log(pages.length);
      // kernel.module.Crawler.queue(pages);
      crawler.queue(pages);
    });

    setTimeout(() => {
      next();
    }, delay)

  }, (err) => {});  

}
