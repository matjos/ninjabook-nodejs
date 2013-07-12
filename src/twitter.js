var Q = require('q');
var _ = require('lodash');
var print = require('./print');
var S = require('string');

var withScreenName = function(datum, ninja) {
	return S(datum).padLeft(6).s +
		'\t @' +
		S(ninja.twitter.screenName).padRight(21, '.').s;
};

module.exports.printFollowers = function(ninjas, options) {
	print.ranked(filterTwitterers(ninjas), options, function(ninja) {
		return ninja.twitter.data.followers_count;		
	}, function(ninja) {
		return withScreenName(ninja.twitter.data.followers_count, ninja);
	});
};

module.exports.printFriends = function(ninjas, options) {
	print.ranked(filterTwitterers(ninjas), options, function(ninja) {
		return ninja.twitter.data.friends_count;
	}, function(ninja) {
		return withScreenName(ninja.twitter.data.friends_count, ninja);
	});
};

var stalkerQuotient = function(ninja) {
	var nom = ninja.twitter.data.friends_count;
	var denom = ninja.twitter.data.followers_count;
	if (denom === 0) {
		return Number.MAX_VALUE;
	}
	return nom / denom;
};

module.exports.printStalkers = function(ninjas, options) {
	print.ranked(filterTwitterers(ninjas), options, function(ninja) {
		return stalkerQuotient(ninja);		
	}, function(ninja) {
		return withScreenName(stalkerQuotient(ninja).toFixed(2), ninja);
	});
};

module.exports.printBadass = function(ninjas, options) {
	print.ranked(filterTwitterers(ninjas), options, function(ninja) {
		return 1 / stalkerQuotient(ninja);		
	}, function(ninja) {
		return withScreenName((1/stalkerQuotient(ninja)).toFixed(2), ninja);
	});
};

module.exports.printTweets = function(ninjas, options) {
	print.ranked(filterTwitterers(ninjas), options, function(ninja) {
		return ninja.twitter.data.statuses_count;		
	});
};
