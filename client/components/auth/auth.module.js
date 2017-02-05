'use strict';

angular.module('meanApp.auth', ['meanApp.constants', 'meanApp.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
