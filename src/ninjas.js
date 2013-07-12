var Q = require('q');
var getMeet = require('./providers/meet_data');

var scrapeAllNinjas = function() {
	var deferred = Q.defer();
	
	getMeet().then(function(ninjas) {
		Q.allSettled([
			require('./stackoverflow').requestScores(ninjas),
			require('./github').requestInfo(ninjas),
			require('./twitter').requestData(ninjas)
		]).then(function() {
			deferred.resolve(ninjas);
		});
	});
	
	return deferred.promise;
};

module.exports.requestNinjas = function (forceUpdate) {
	var deferred = Q.defer(), fileDb = require('./filedb');
	
	if (forceUpdate) {
		scrapeAllNinjas().then(fileDb.save);		
	} else {
		fileDb.load()
			.then(
				function(loadedNinjas) {
					deferred.resolve(loadedNinjas);
				}, 
				function() {
					scrapeAllNinjas().then(function(scrapedNinjas) {
						fileDb.save(scrapedNinjas);
						deferred.resolve(scrapedNinjas);
					}, function(reason) {
						console.error(reason);
						deferred.reject(reason);
					});
				});
		
	}
	
	return deferred.promise;
};
