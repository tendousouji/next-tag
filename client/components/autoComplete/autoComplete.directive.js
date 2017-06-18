'use strict';

angular.module('meanApp')
  .directive('autoComplete', function($) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var hintSource = [
          "ActionScript",
          "AppleScript",
          "Asp",
          "BASIC",
          "C",
          "C++",
          "Clojure",
          "COBOL",
          "ColdFusion",
          "Erlang",
          "Fortran",
          "Groovy",
          "Haskell",
          "Java",
          "JavaScript",
          "Lisp",
          "Perl",
          "PHP",
          "Python",
          "Ruby",
          "Scala",
          "Scheme"
        ];

        $('#searchInput').autocomplete({
          source: hintSource
        });
      }
    }
  });
