var ninjabook = require('../ninjas');
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

var getTotals = function(ninjas) {

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
	
	return {
		github: {
			repos: {
				sum: sums.repos,
				topNinja: {
					name: topNinja.repos.name,
					score: topNinja.repos.github.data.public_repos
				}
			},
			gists: {
				sum: sums.gists,
				topNinja: {
					name: topNinja.gists.name,
					score: topNinja.gists.github.data.public_gists
				}
			},
			ninjaCount: githubbers.size()
		},
		twitter: {
			tweets: {
				sum: sums.tweets,
				topNinja: {
					name: topNinja.tweets.name,
					score: topNinja.tweets.twitter.data.statuses_count
				}
			},
			ninjaCount: twitterers.size()
		},
		so: {
			rep: {
				sum: sums.rep,
				topNinja: {
					name: topNinja.rep.name,
					score: topNinja.rep.so.data.reputation
				}
			},
			ninjaCount: stackers.size()
		},
		ninjaCount: ninjas.length
	};
};

module.exports = function() {
	return ninjabook.requestNinjas().then(getTotals);
};