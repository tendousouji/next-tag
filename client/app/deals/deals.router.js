'use strict';

angular.module('meanApp.deals')
  .config(function($stateProvider) {
    $stateProvider.state('deals', {
      url: '/best-deals',
      templateUrl: 'app/deals/deals.html',
      controller: 'DealsController',
      controllerAs: 'vm'
    });
  });
