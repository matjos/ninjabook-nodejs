var Q = require('q');

module.exports.twitter = function() {
	return Q.fcall(function() {
		var params = {
			"consumer_key": process.env.TWITTER_CONSUMER_KEY,
			"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
			"oauth_token": process.env.TWITTER_OAUTH_TOKEN,
			"oauth_token_secret": process.env.TWITTER_OAUTH_TOKEN_SECRET
		};
		return params;
	});
};