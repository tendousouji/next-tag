'use strict';

angular.module('meanApp.products_search', ['meanApp.constants', 'meanApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
  