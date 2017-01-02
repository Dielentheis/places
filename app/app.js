'use strict';

// Declare app level module which depends on views, and components
angular.module('places', [
  'ngRoute',
  'places.main',
  'places.results'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);
