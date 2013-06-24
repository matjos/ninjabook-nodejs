var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');
var fileDb = require('./filedb');
var so = require('./stackoverflow');

var requestNinjas = function() {
	var deferred = Q.defer();
	
	fileDb.load().then(
		function(loaded) {
			deferred.resolve(loaded);
		},
		function(reason) {
			// if no file is available to load, start scrapin'!
			request('http://tretton37.com/career/meet/', function(err, resp, body) {
				if (err) {
					deferred.reject(err);
					console.error(err);
					return;
				}
				
				var ninjas = require('./ninjas').scrapeNinjas(body);
				
				so.requestScores(ninjas).then(function() {
					deferred.resolve(ninjas);
					fileDb.save(ninjas);
				});
			});	
		});
	
	return deferred.promise;
};

requestNinjas()
	.then(so.printScores);
