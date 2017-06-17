'use strict';

(function() {

  class MainController {

    constructor($http, $scope, $state, socket, ProductSearchService, $cookies) {
      this.$http = $http;

      // $scope.$on('$destroy', function() {
      //   //do anything such as remove socket
      // });
      // //TODO - create my component
      // console.log(socket);
      // socket.socketIO.emit('context', {
      //   _id: '123'
      // });

      // socket.socketIO.on('test', (data) => {
      //   console.log(data);
      // });
      $scope.page = 1;
      $scope.perPage = 10;

      $scope.getProduct = (form) => {
        
        if($cookies.get('products')) {
          $cookies.remove('products');
        }

        var queries = 'page='+$scope.page+'&limit='+$scope.perPage;
        var searchWord = $scope.searchWorld;
        $cookies.put('searchWord', searchWord);
        // console.log(searchWorld);
        ProductSearchService.productSearch(searchWord, queries, (err, resp) => {
          if(err) { console.log(err); }
          // console.log(resp);

          // $cookies.put('products', resp);
          localStorage.setItem('products', JSON.stringify(resp));
          $state.go('search');
        });

      }
    }
  }

  angular.module('meanApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
