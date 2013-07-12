var Q = require('q');
var nconf = require('nconf');

module.exports.twitter = function() {
	return Q.fcall(function() {
		nconf.env().file({file: 'config.json'});
		
		var params = {
			"consumer_key": nconf.get("TWITTER_CONSUMER_KEY"),
			"consumer_secret": nconf.get("TWITTER_CONSUMER_SECRET"),
			"oauth_token": nconf.get("TWITTER_OAUTH_TOKEN"),
			"oauth_token_secret": nconf.get("TWITTER_OAUTH_TOKEN_SECRET")
		};
		return params;
	});
};