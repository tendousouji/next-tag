'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket, ProductSearchService) {
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
        
        var searchWorld = $scope.searchWorld;
        console.log(searchWorld);
        ProductSearchService.productSearch(searchWorld, (err, resp) => {
          if(err) { console.log(err); }
          console.log(resp);
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
