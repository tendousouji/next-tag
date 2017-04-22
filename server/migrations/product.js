'use strict';
import async from 'async';
import fs from 'fs';

module.exports = (ProductTypeModel, cb) => {
  async.waterfall([
    (cb) => {
      console.log('Migrate data from Tiki data file');
      var result = fs.readFileSync('tiki.txt', 'utf-8').split('\n');
      // console.log(result.length);
      for (var i = 0; i < 20; i+=10) {
        console.log(result[i]);
        console.log(result[i+1].replace('Id: ', ''));
        console.log(result[i+2].replace('Link: ', ''));
        console.log(result[i+3].replace('Category: ', ''));
        console.log(result[i+4].replace('Product: ', ''));
        console.log(result[i+5].replace('Price: ', ''));
        console.log(result[i+6].replace('Discount: ', ''));
        console.log(result[i+7].replace('Original Price: ', ''));
        console.log(result[i+8].replace('Image: ', ''));
        console.log(result[i+9].replace('Review: ', ''));
      }
      // ProductTypeModel.find({})
      //   .remove()
      //   .then(() => {
      //     ProductTypeModel.create({
            
      //     })
      //     .then(() => {
            
      //     });
      //   });
    }
  ], () => {
    cb();
  });  
}
