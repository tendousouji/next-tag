'use strict';
import async from 'async';
import fs from 'fs';

module.exports = (ProductTypeModel, CategoryTypeModel, ES, Redis, cb) => {
  async.waterfall([
    // (cb) => {
    //   console.log('Migrate data from Tiki data file');
    //   var result = fs.readFileSync('tiki.txt', 'utf-8').split('\n');
    //   // console.log(result.length);
    //   var productArray = [];
    //   for (var i = 0; i < result.length; i+=10) {
    //     productArray.push({
    //       'id' : result[i+1].replace('Id: ', ''),
    //       'link' : result[i+2].replace('Link: ', ''),
    //       'category' : result[i+3].replace('Category: ', ''),
    //       'name' : result[i+4].replace('Product: ', ''),
    //       'price' : result[i+5].replace('Price: ', ''),
    //       'discount' : result[i+6].replace('Discount: ', ''),
    //       'originPrice' : result[i+7].replace('Original Price: ', ''),
    //       'image' : result[i+8].replace('Image: ', ''),
    //       'review' : result[i+9].replace('Review: ', '')
    //     });
    //   }
    //   // console.log(productArray);
    //   let id = 0;
    //   let categoryId = 0;
    //   async.each(productArray, (item, callback) => {
    //     CategoryTypeModel.findOne({'name': item.category})
    //       .then(category => {
            
    //         if(category) {

    //           // console.log(category.id);

    //           let data = {
    //             productId: item.id,
    //             productLink: item.link,
    //             productName: item.name,
    //             price: item.price,
    //             discount: item.discount,
    //             originPrice: item.originPrice,
    //             image: item.image,
    //             website: 'https://tiki.vn/',
    //             categoryId: category.id
    //           }

    //           ES.create({
    //             type : 'products',
    //             id: id,
    //             data : data
    //           }, (err, resp) => {
    //             if(err) { return console.log(err); }
    //             console.log(resp);
    //           });

    //           ++id;

    //           // ProductTypeModel.create({
    //           //   productId: item.id,
    //           //   productLink: item.link,
    //           //   productName: item.name,
    //           //   price: item.price,
    //           //   discount: item.discount,
    //           //   originPrice: item.originPrice,
    //           //   image: item.image,
    //           //   website: 'https://tiki.vn/',
    //           //   categoryId: category.id
    //           // })
    //           // .then(() => {});

    //         } else {

    //           CategoryTypeModel.create({
    //             'name': item.category
    //           })
    //           .then(category => {
    //             // console.log(resp);

    //             ES.create({
    //               type : 'categories',
    //               id: category.id,
    //               data : { 'name': item.category }
    //             }, (err, resp) => {
    //               if(err) { return console.log(err); }
    //               console.log(resp);
    //             });

    //             let data = {
    //               productId: item.id,
    //               productLink: item.link,
    //               productName: item.name,
    //               price: item.price,
    //               discount: item.discount,
    //               originPrice: item.originPrice,
    //               image: item.image,
    //               website: 'https://tiki.vn/',
    //               categoryId: category.id
    //             }

    //             ES.create({
    //               type : 'products',
    //               id: id,
    //               data : data
    //             }, (err, resp) => {
    //               if(err) { return console.log(err); }
    //               console.log(resp);
    //             });

    //             ++id;

    //             // ProductTypeModel.create({
    //             //   productId: item.id,
    //             //   productLink: item.link,
    //             //   productName: item.name,
    //             //   price: item.price,
    //             //   discount: item.discount,
    //             //   originPrice: item.originPrice,
    //             //   image: item.image,
    //             //   website: 'https://tiki.vn/',
    //             //   categoryId: category.id
    //             // })
    //             // .then(() => {});

    //           });

    //         }

    //       });
    //   }, (err) => {
    //     if(err) { return console.log('Migrate data error'); }
    //     console.log('Migrate data success');
    //     cb();
    //   });
    // }
    (cb) => {
      Redis.sadd('tikiLinks', ['https://tiki.vn']);
      Redis.sadd('lazadaLinks', ['http://www.lazada.vn']);
      Redis.sadd('hotDealLinks', ['https://www.hotdeal.vn/ho-chi-minh']);
    }
  ], () => {
      cb();
  });  
}
