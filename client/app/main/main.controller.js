'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket) {
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
    }
  }

  angular.module('meanApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
