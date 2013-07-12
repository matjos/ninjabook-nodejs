var _ = require('lodash');

var getGitHubbers = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.github.data;
	});
};

var getTwitterers = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.twitter.data;
	});
};

var getStackers = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.so.data;
	});
};


module.exports = function(ninjas, options) {
	var sums = {
		repos: 0,
		gists: 0,
		tweets: 0,
		rep: 0
	};
	
	githubbers = getGitHubbers(ninjas);
	githubbers.each(function (ninja) {
		sums.repos += ninja.github.data.public_repos;
		sums.gists += ninja.github.data.public_gists;
	});
	
	twitterers = getTwitterers(ninjas);
	twitterers.each(function (ninja) {
		sums.tweets += ninja.twitter.data.statuses_count;
	});
	
	stackers = getStackers(ninjas);
	stackers.each(function (ninja) {
		sums.rep += ninja.so.data.reputation;
	});
	
	console.log(githubbers.size(), 'ninjas uses Github')
	console.log('Total no. of public repos:\t', sums.repos, 'repos');
	console.log('Total no. of public gists:\t', sums.gists, 'gists');
	console.log(twitterers.size(), 'ninjas uses Twitter')
	console.log('Total no. of tweets:\t\t', sums.tweets, 'tweets');
	console.log(stackers.size(), 'ninjas uses StackOverflow')
	console.log('Total amount of rep:\t\t', sums.rep, 'points');
	
};