var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');
var fileDb = require('./filedb');

var requestNinjas = function() {
	var deferred = Q.defer();
	
	fileDb.load()
		.then(
			function(loadedNinjas) {
				deferred.resolve(loadedNinjas);
			}, 
			function() {
				require('./ninjas').scrapeAllNinjas().then(function(scrapedNinjas) {
					fileDb.save(scrapedNinjas);
					deferred.resolve(scrapedNinjas);
				}, function(reason) {
					console.error(reason);
					deferred.reject(reason);
				});
			});
	
	return deferred.promise;
};

var ninjaPromise = requestNinjas();

ninjaPromise.then(require('./stackoverflow').printScores);
