'use strict';

(function() {

  function ProductSearchService(Util, ProductSearchResource) {
    const service = {};
    var safeCb = Util.safeCb;

    service.productSearch = function(search, queries, callback) {
      // console.log(search, queries);
      return ProductSearchResource.productSearch({queries: queries}, {search: search})
        .$promise.then(data => {
          if(data) {
            // console.log(data);
          } else {
            
          }
          safeCb(callback)(null, data);
          return data;
        })
        .catch(err => {
          safeCb(callback)(err);
          return {};
        });
    }

    return service;
  }

  angular.module('meanApp.products_search')
    .factory('ProductSearchService', ProductSearchService);
})();

