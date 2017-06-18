'use strict';

angular.module('meanApp')
  .directive('heightAdjust', function($) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var windowHeight = $(window).height();
        var sectionHeight = windowHeight - 76;
        // console.log(sectionHeight);
        $('section.shopping').css('height', sectionHeight);
      }
    }
  });
