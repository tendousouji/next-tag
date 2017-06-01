'use strict';

(function() {

  class SearchController {
    constructor($cookies) {
      // var result = $cookies.get('products');
      var result = localStorage.getItem('products');
      // console.log(result);
      this.products = JSON.parse(result).items;
      console.log(this.products);
    }
  }

  angular.module('meanApp.search-result')
    .controller('SearchController', SearchController);
})();
