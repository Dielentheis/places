'use strict';

angular.module('places.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$location', 'QueryFactory', function(sc, $location, QueryFactory) {
    sc.grabQuery = function(query) {
    	QueryFactory.setQuery(query);
    	$location.path("/results");
    };
}])

.factory('QueryFactory', function() {
	var toReturn = {};

	var userQuery = "";

	toReturn.setQuery = function(query) {
		userQuery = query;
	};

	toReturn.getQuery = function() {
		return userQuery;
	}

	return toReturn;
});