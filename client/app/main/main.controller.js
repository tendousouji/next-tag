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

      $scope.getProduct = (form) => {
        
        if($cookies.get('products')) {
          $cookies.remove('products');
        }

        var searchWorld = $scope.searchWorld;
        console.log(searchWorld);
        ProductSearchService.productSearch(searchWorld, (err, resp) => {
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
