var Q = require('q');
var _ = require('lodash');
var request = require('request');

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

var filterNinjas = function(ninjas, sortByIterator) {
	return _(ninjas).filter(function(ninja) {
			return ninja.github.data;
		}).sortBy(sortByIterator);
};

module.exports.printRepos = function(ninjas, options) {
	var i = 1;
	filterNinjas(ninjas, function(ninja) {
			return -ninja.github.data.public_repos;
		})
		.first(options.top)
		.each(function(ninja) {
			console.log(i++ + '.\t' + ninja.github.data.public_repos + '\t' + ninja.name);
		});
	
};

module.exports.printGists = function(ninjas, options) {
	var i = 1;
	filterNinjas(ninjas, function(ninja) {
			return -ninja.github.data.public_gists;
		})
		.first(options.top)
		.each(function(ninja) {
			console.log(i++ + '.\t' + ninja.github.data.public_gists + '\t' + ninja.name);
		});
};