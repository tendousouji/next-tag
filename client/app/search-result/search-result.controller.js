'use strict';

(function() {

  class SearchController {
    constructor($cookies, ProductSearchService) {
      // var result = $cookies.get('products');
      var result = localStorage.getItem('products');
      // console.log(result);
      this.totalItem = JSON.parse(result).totalItem; 
      this.products = JSON.parse(result).items;
      this.perPage = 10;
      this.page = 1;
      // console.log(this.products);
      this.listChange = () => {
        var searchWord = $cookies.get('searchWord');
        console.log(searchWord);
        var queries = 'page='+this.page+'&limit='+this.perPage;
        ProductSearchService.productSearch(searchWord, queries, (err, resp) => {
          if(err) { console.log(err); }
          console.log(resp);
          this.products = resp.items;
        });
      }
    }
  }

  angular.module('meanApp.search-result')
    .controller('SearchController', SearchController);
})();
