'use strict';

(function() {

  function ProductSearchService(Util, ProductSearchResource) {
    const service = {};
    var safeCb = Util.safeCb;

    service.productSearch = function(search, callback) {
      return ProductSearchResource.productSearch({search: search})
        .$promise.then(data => {
          if(data) {
            
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

