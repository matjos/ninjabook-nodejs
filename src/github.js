var Q = require('q');
var _ = require('lodash');
var request = require('request');
var print = require('./print');

var requestInfo = function(ninja) {
	var deferred = Q.defer();

	console.log("Requesting: " + ninja.github.apiurl + " ...");
	request({
		url: ninja.github.apiurl,
		headers: {
			'user-agent': "ninjabook"
		} 
	}, function(err, resp, body) {
		if (err) {
			deferred.reject(err);
			console.error(err);
			return;
		}
		ninja.github.data = JSON.parse(body);
		deferred.resolve(ninja);
	});

	return deferred.promise;
};

module.exports.requestInfo = function(ninjas) {
	var gNinjas = [];
	_(ninjas)
		.filter(function(ninja) { return ninja.github.apiurl; })
		.each(function(ninja) {
			gNinjas.push(requestInfo(ninja));
		});
	return Q.all(gNinjas);
};

var filtered = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.github.data;
	});
};

module.exports.printRepos = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return ninja.github.data.public_repos;		
	});
};

module.exports.printGists = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return ninja.github.data.public_gists;		
	});
};