var Q = require('q');
var _ = require('lodash');
var print = require('./print');

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