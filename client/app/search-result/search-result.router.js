'use strict';

angular.module('meanApp.search-result')
  .config(function($stateProvider) {
    $stateProvider.state('search', {
      url: '/search',
      templateUrl: 'app/search-result/search-result.html',
      controller: 'SearchController',
      controllerAs: 'vm'
    });
  });  
