var cheerio = require('cheerio');
var Q = require('q');
var request = require('request');
var _ = require('lodash');
var OAuth = require('OAuth');

var getTwitterData = function(oauth, params, screenNames) {
	var deferred = Q.defer();
	
	if (!oauth && !screenNames) { 
		deferred.reject(new Error('Invalid screenname and OAuth params'));
		return deferred.promise;
	}
	
	var getUrl = 'https://api.twitter.com/1.1/users/lookup.json?screen_name='+screenNames;
	console.log("Requesting: " + getUrl + " ...");	
	oauth.get(
		getUrl,
		params.oauth_token,
		params.oauth_token_secret,
		function (e, data, res){
			if (e) {
				deferred.reject(e);
				return console.error(e);
			}
			var jsonData = JSON.parse(data);
			deferred.resolve(jsonData);
		});
		
	return deferred.promise;
};

var filterTwitterers = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.twitter.url;
	});
};

module.exports.requestData = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas);

	return require('./filedb').loadTwitterOauth().then(function(params) {
		if (!params) {
			var err = new Error('No params');
			console.error(err);
			throw err;
		}
		
		var oauth = new OAuth.OAuth(
			'https://api.twitter.com/oauth/request_token',
			'https://api.twitter.com/oauth/access_token',
			params.consumer_key,
			params.consumer_secret,
			'1.0A',
			null,
			'HMAC-SHA1'
		);

		var screenNames = _ninjas.map(function(ninja) { return ninja.twitter.screenName; }).join(',');

		return Q.all([getTwitterData(oauth, params, screenNames)]).then(function(twitterData) {
			var twitterers = _.groupBy(twitterData[0], 
				function(ninja) { return ninja.screen_name.toLowerCase(); });

			_ninjas.each(function(ninja) {
				var key = ninja.twitter.screenName.toLowerCase();
				ninja.twitter.data = twitterers[key][0];
			});
		});		
	});
};

module.exports.printFollowers = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas).sortBy(function(ninja) {
		return -ninja.twitter.data.followers_count;
	}).first(10).each(function(ninja) {
		console.log(ninja.twitter.data.followers_count + '\t' + ninja.name);
	});
};

module.exports.printFriends = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas).sortBy(function(ninja) {
		return -ninja.twitter.data.friends_count;
	}).first(10).each(function(ninja) {
		console.log(ninja.twitter.data.friends_count + '\t' + ninja.name);
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

module.exports.printStalkers = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas).sortBy(function(ninja) {
		return -stalkerQuotient(ninja);
	}).first(10).each(function(ninja) {
		console.log(stalkerQuotient(ninja).toFixed(2) + '\t' + ninja.name);
	});
};

module.exports.printBadass = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas).sortBy(function(ninja) {
		return stalkerQuotient(ninja);
	}).first(10).each(function(ninja) {
		console.log((1/stalkerQuotient(ninja)).toFixed(2) + '\t' + ninja.name);
	});
};

module.exports.printTweets = function(ninjas) {
	var _ninjas = filterTwitterers(ninjas).sortBy(function(ninja) {
		return -ninja.twitter.data.statuses_count;
	}).first(10).each(function(ninja) {
		console.log(ninja.twitter.data.statuses_count + '\t' + ninja.name);
	});
};