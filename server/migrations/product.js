'use strict';
import async from 'async';
import fs from 'fs';

module.exports = (ProductTypeModel, CategoryTypeModel, cb) => {
  async.waterfall([
    (cb) => {
      console.log('Migrate data from Tiki data file');
      var result = fs.readFileSync('tiki.txt', 'utf-8').split('\n');
      // console.log(result.length);
      var productArray = [];
      for (var i = 0; i < result.length; i+=10) {
        // console.log(result[i]);
        // console.log(result[i+1].replace('Id: ', ''));
        // console.log(result[i+2].replace('Link: ', ''));
        // console.log(result[i+3].replace('Category: ', ''));
        // console.log(result[i+4].replace('Product: ', ''));
        // console.log(result[i+5].replace('Price: ', ''));
        // console.log(result[i+6].replace('Discount: ', ''));
        // console.log(result[i+7].replace('Original Price: ', ''));
        // console.log(result[i+8].replace('Image: ', ''));
        // console.log(result[i+9].replace('Review: ', ''));
        productArray.push({
          'id' : result[i+1].replace('Id: ', ''),
          'link' : result[i+2].replace('Link: ', ''),
          'category' : result[i+3].replace('Category: ', ''),
          'name' : result[i+4].replace('Product: ', ''),
          'price' : result[i+5].replace('Price: ', ''),
          'discount' : result[i+6].replace('Discount: ', ''),
          'originPrice' : result[i+7].replace('Original Price: ', ''),
          'image' : result[i+8].replace('Image: ', ''),
          'review' : result[i+9].replace('Review: ', '')
        });
      }
      // console.log(productArray);
      async.each(productArray, (item, callback) => {
        CategoryTypeModel.findOne({'name': item.category})
          .then(category => {
            
            if(category) {

              // console.log(category.id);

              ProductTypeModel.create({
                productId: item.id,
                productLink: item.link,
                productName: item.name,
                price: item.price,
                discount: item.discount,
                originPrice: item.originPrice,
                image: item.image,
                website: 'https://tiki.vn/',
                categoryId: category.id
              })
              .then(() => {});

            } else {

              CategoryTypeModel.create({
                'name': item.category
              })
              .then(category => {
                // console.log(resp);
                ProductTypeModel.create({
                  productId: item.id,
                  productLink: item.link,
                  productName: item.name,
                  price: item.price,
                  discount: item.discount,
                  originPrice: item.originPrice,
                  image: item.image,
                  website: 'https://tiki.vn/',
                  categoryId: category.id
                })
                .then(() => {});
              });

            }

          });
        // ProductTypeModel.find({})
        //   .remove()
        //   .then(() => {
        //     ProductTypeModel.create({
                    
        //     })
        //     .then(() => {
              
        //     });
        //   });
      }, (err) => {
        if(err) { return console.log('Migrate data error'); }
        console.log('Migrate data success');
        cb();
      });
    }
  ], () => {
    cb();
  });  
}
