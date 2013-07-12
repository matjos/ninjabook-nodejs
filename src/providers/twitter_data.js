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

var requestTwitterData = function(ninjas) {
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

module.exports = function(ninjas) {
	return requestTwitterData(ninjas);
};