var Q = require('q');
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var print = require('./print');

var getId = function(url) {
	var match = /\/[0-9]*$/gi.exec(url);
	return match[0].substring(1);
};

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
		ninja.so.id = getId(ninja.so.url);
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

var filtered = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.so.rep;
	});
};

module.exports.printScores = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return getIntRep(ninja);		
	});
};

module.exports.printIds = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return -ninja.so.id;		
	}, function(ninja) {
		return ninja.so.id;
	});
};