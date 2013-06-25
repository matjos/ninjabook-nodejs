var Q = require('q');
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');

var requestScore = function(ninja) {
	var deferred = Q.defer();

	console.log("Requesting: " + ninja.so.url + " ...");
	request({
		url: ninja.so.url,
		headers: {
			'user-agent': "ninjabook"
		} 
	}, function(err, resp, body) {
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
	return Q.all(soNinjas);
};

var getIntRep = function(ninja) {
	var rep = ninja.so.rep;
	var repInt = parseInt(rep.replace(/,/g, ''), 10);
	return repInt;
};

module.exports.printScores = function(ninjas, options) {
	_(ninjas)
		.filter(function(ninja) {
			return ninja.so.rep;
		})
		.sortBy(function(ninja) {
			return -getIntRep(ninja);
		})
		.first(options.top)
		.each(function(ninja) {
			console.log(getIntRep(ninja) + '\t' + ninja.name);
		});
};