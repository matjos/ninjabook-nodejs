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

	var githubbers = getGitHubbers(ninjas);
	var twitterers = getTwitterers(ninjas);
	var stackers = getStackers(ninjas);

	var topNinja = {
		repos: githubbers.first(),
		gists: githubbers.first(),
		tweets: twitterers.first(),
		rep: stackers.first()
	};
	
	githubbers.each(function (ninja) {
		var repos = ninja.github.data.public_repos;
		sums.repos += repos;
		if(topNinja.repos.github.data.public_repos < repos) {
			topNinja.repos = ninja;
		}
		var gists = ninja.github.data.public_gists;
		sums.gists += gists;
		if(topNinja.gists.github.data.public_gists < gists) {
			topNinja.gists = ninja;
		}
	});
	
	twitterers.each(function (ninja) {
		var tweets = ninja.twitter.data.statuses_count;
		sums.tweets += tweets;
		if(topNinja.tweets.twitter.data.statuses_count < tweets) {
			topNinja.tweets = ninja;
		}
	});
	
	stackers.each(function (ninja) {
		var rep = ninja.so.data.reputation;
		sums.rep += rep;
		if(topNinja.rep.so.data.reputation < rep) {
			topNinja.rep = ninja;
		}
	});
	
	console.log(githubbers.size() + ' ninjas uses Github');
	console.log('Total no. of public repos:\t', sums.repos, 'repos');
	console.log(' ', topNinja.repos.name, 
		'has the most with', 
		topNinja.repos.github.data.public_repos, 
		"repos");
	console.log('Total no. of public gists:\t', sums.gists, 'gists');
	console.log(' ', topNinja.gists.name, 
		'has the most with', 
		topNinja.gists.github.data.public_gists, 
		"gists");
		
	console.log(twitterers.size() + ' ninjas uses Twitter');
	console.log('Total no. of tweets:\t\t', sums.tweets, 'tweets');
	console.log(' ', topNinja.tweets.name, 
		'has tweeted the most with', 
		topNinja.tweets.twitter.data.statuses_count, 
		"tweets");
	
	
	console.log(stackers.size() + ' ninjas uses StackOverflow');
	console.log('Total amount of rep:\t\t', sums.rep, 'points');
	console.log(' ', topNinja.rep.name, 
		'is the most reputable with', 
		topNinja.rep.so.data.reputation, 
		"points");
	
	
};