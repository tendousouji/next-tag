import async from 'async';
import Crawler from 'crawler';

function uniqueNumber() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

exports.name = 'TikiData';
exports.routes = require('./routes');
// exports.module = (kernel) => {
//   var delay = 1000 * 60;
//   var store = kernel.redisClient;

//   var crawler = new Crawler({
//     maxConnections: 30,
//     rateLimit: 1000,
//     callback: function(err, resp, done) {
//       if(err) { return console.log(err); }

//       var $ = resp.$;
//       var tikiUrl = 'https://tiki.vn';

//       var store = kernel.redisClient;
//       var ES = kernel.ES;

//       var absoluteLinks = $("a[href^='http']");
//       var relativeLinks = $("a[href^='/']");
//       var checkLink = absoluteLinks[0].attribs.href;

//       var productLink = $('.product-container').children('meta').attr('content'); 
//       if(productLink) {
//         // console.log('===================');
//         // console.log(productLink);
//         // console.log($('.item-name').text());
//         // console.log($('#product_id').attr('value'));
//         // console.log($('#productset_name').attr('value'));
//         // console.log($('#span-price').text());
//         // console.log($('#span-list-price').text());
//         // console.log($('#span-saving-price').clone().children().remove().end().text());
//         // console.log($('.swiper-slide:nth-child(1)').attr('data-zoom-image'));
//         // console.log($('.content#gioi-thieu').text());
//         var categoryName = $('#productset_name').attr('value');
//         var productId = $('#product_id').attr('value');
//         var productLink = productLink;
//         var productName = $('.item-name').text();
//         var price = $('#span-price').text();
//         var discount = $('#span-saving-price').clone().children().remove().end().text();
//         var originPrice = $('#span-list-price').text();
//         var image = $('.swiper-slide:nth-child(1)').attr('data-zoom-image');
//         var description = $('.content#gioi-thieu').text();

//         let categoryQuery = {
//           query: {
//             match: {
//               name: categoryName
//             }
//           }
//         }

//         let productQuery = {
//           query: {
//             match: {
//               productId: productId
//             }
//           } 
//         }

//         ES.search(categoryQuery, 'categories', (err, resp) => {
//           if(err) {
//             // console.log(err);
//             if(err.status == 404) {
//               var categoryId = uniqueNumber();
//               ES.create({
//                 type : 'categories',
//                 id: categoryId,
//                 data : { 'name': categoryName }
//               }, (err, resp) => {
//                 if(err) { return console.log(err); }
//                 // console.log(resp);
//               });                
//             }
//           }
//           // console.log(resp);
//         });

//         let productData = {
//           productId: productId,
//           productLink: productLink,
//           productName: productName,
//           price: price,
//           discount: discount,
//           originPrice: originPrice,
//           image: image,
//           description: description,
//           website: 'https://tiki.vn/',
//           category: categoryName
//         }

//         ES.search(productQuery, 'products', (err, resp) => {
//           if(err) {
//             if(err.status == 404) {
//               ES.create({
//                 type : 'products',
//                 id: productId,
//                 data : productData
//               }, (err, resp) => {
//                 if(err) { return console.log(err); }
//                 console.log(resp);
//               });
//             }
//           }
//           // console.log(resp);
//           if(resp.items.length == 0) {
//             ES.create({
//               type : 'products',
//               id: productId,
//               data : productData
//             }, (err, resp) => {
//               if(err) { return console.log(err); }
//               console.log(resp);
//             });
//           }
//         });
//       }

//       store.smembers('tikiLinks', (err, pages) => {
//         // console.log(pages);
//         for (var i = 0; i < absoluteLinks.length; ++i) {
//           var link = absoluteLinks[i].attribs.href;
//           if(pages.indexOf(link) == -1) {
//             if(link.includes(tikiUrl)) {
//               pages.push(link);
//             }
//           }
//         }
//         for (var j = 0; j < relativeLinks.length; ++j) {
//           var link = relativeLinks[j].attribs.href;
//           var fullLink = tikiUrl+link;
//           if(pages.indexOf(fullLink) == -1) {
//             pages.push(fullLink);
//           }
//         }
//         store.sadd('tikiLinks', pages);
//       });
//       done();
//     }
//   });

//   async.forever((next) => {

//     console.log('Tiki Crawler')
//     store.smembers('tikiLinks', (err, pages) => {
//       console.log(pages.length);
//       crawler.queue(pages);
//       // kernel.module.Crawler.queue(pages);
//     });

//     setTimeout(() => {
//       next();
//     }, delay);

//   }, (err) => {});

// }
