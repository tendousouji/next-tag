'use strict';

(function() {

  function ProductSearchResource($resource) {
    return $resource('/api/v1/product_search/:id/:controller?:queries', {
      id: '@_id'
    }, {
      productSearch: {
        method: 'POST'
      }
    });
  }

  angular.module('meanApp.products_search')
    .factory('ProductSearchResource', ProductSearchResource);
})();
