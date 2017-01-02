'use strict';

angular.module('places.results', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/results', {
    templateUrl: 'results/results.html',
    controller: 'ResultsCtrl'
  });
}])

.controller('ResultsCtrl', ['$scope', 'QueryFactory', '$location', function(sc, QueryFactory, $location) {
	var query = QueryFactory.getQuery();

	makeMap();

	sc.searchAgain = function() {
		$location.path("/");
	};

	function makeMap() {
		sc.results = [];
		var zenefits = new google.maps.LatLng(37.7853406,-122.3975711);

		var map = new google.maps.Map(document.getElementById('map'), {
		    center: zenefits,
		    zoom: 15
		});

		var marker = new google.maps.Marker({
  				  icon: 'http://i68.tinypic.com/21b2ihz.png',
  				  position: zenefits,
  				  map: map
  		});

		var request = {
		  location: zenefits,
		  radius: '2000',
		  types: ['bakery', 'bar', 'cafe', 'food', 'meal_delivery', 'meal_takeaway', 'restaurant'],
		  keyword: query
		};

		var service = new google.maps.places.PlacesService(map);
  		service.nearbySearch(request, callback);

  		function callback(results, status) {
  		  if (status == google.maps.places.PlacesServiceStatus.OK) {
		      sc.results = results;
		      sc.$digest();
		      placeMarkers(results);
  		  }
  		  else {
  		  	  sc.results = [{name: 'Sorry, there were no search results for your query \'' + query + '\'. Please try again!'}];
  		  }
  		  console.log(sc.results);
  		}

  		var markers = [];
  		var names = [];

  		function placeMarkers(places) {
  			$('#list li').each(function(i, e) {
  			  names.push(e);
  			});

  			var bounds = new google.maps.LatLngBounds();

  			for (var i = 0; i < places.length; i++) {
  				// places markers
  				marker = new google.maps.Marker({
  				  icon: {
  				  	path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
  				  	scale: 6.0,
  				  	fillColor: "#ef7970",
  				  	fillOpacity: 0.9,
  				  	strokeWeight: 0.4
  				  },
  				  position: places[i].geometry.location,
  				  map: map
  				});

  				// makes sure map is zoomed correctly to fit all markers
  				bounds.extend(places[i].geometry.location);
  				markers.push(marker);

  				// changes to white on hover
  				google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
  				    return function() {
  				    	var text = $(names[i]).text();
  				    	$(names[i]).css('font-weight', 'bold');
  				    	$(names[i]).text('★ ' + text);
						marker.setIcon({
		  				  	path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
		  				  	scale: 6.0,
		  				  	fillColor: "#FFF",
		  				  	fillOpacity: 0.9,
		  				  	strokeWeight: 0.4
		  				});
  				    }
  				})(marker, i));

  				// changes back to red off hover
  				google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
				    return function() {
				    	var text = $(names[i]).text();
				    	$(names[i]).css('font-weight', 'normal');
				    	$(names[i]).text(text.slice(2));
						marker.setIcon({
		  				  	path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
		  				  	scale: 6.0,
		  				  	fillColor: "#ef7970",
		  				  	fillOpacity: 0.9,
		  				  	strokeWeight: 0.4
		  				});
				    }
  				})(marker, i));
  			}

  			// makes sure map is zoomed correctly to fit all markers
  			map.fitBounds(bounds);
  			associateNamesToMarkers(places, markers);
  		}

  		function associateNamesToMarkers(places, markers) {
  			$('#list li').each(function(i, e) {
  			  names.push(e);
			  $(e).mouseenter(function(i) {
			    return function(e) {
			      google.maps.event.trigger(markers[i], 'mouseover');
			    }
			  }(i));
			  $(e).mouseleave(function(i) {
			    return function(e) {
			      google.maps.event.trigger(markers[i], 'mouseout');
			    }
			  }(i));
			});
  		}
	}
}]);
