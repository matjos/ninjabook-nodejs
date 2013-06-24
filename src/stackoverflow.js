var Q = require('q');
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var fileDb = require('./filedb');

var requestScore = function(ninja) {
	var deferred = Q.defer();

	request(ninja.so.url, function(err, resp, body) {
		if (err) {
			deferred.reject(err);
			console.error(err);
			return;
		}
		var $ = cheerio.load(body);
		ninja.so.rep = $('.reputation a').text();
		deferred.resolve(ninja);
	});

	return deferred.promise;
};

module.exports.requestScores = function(ninjas) {
	var soNinjas = [];
	_(ninjas)
		.filter(function(ninja) { return ninja.so.url; })
		.each(function(ninja) {
			soNinjas.push(requestScore(ninja));
		});
	return Q.all(soNinjas).then(function(soNinjas) {
			fileDb.save(ninjas);
			return soNinjas;
		});
};