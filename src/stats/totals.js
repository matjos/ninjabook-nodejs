var ninjabook = require('../ninjas');
var _ = require('lodash');
var humanize = require('humanize');

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
	
	var fnum = function(num) {
		return humanize.numberFormat(num, 0, ',', ' ');
	};
	
	return {
		github: {
			repos: {
				sum: sums.repos,
				fsum: fnum(sums.repos),
				topNinja: {
					name: topNinja.repos.name,
					url: topNinja.repos.github.url,
					score: topNinja.repos.github.data.public_repos,
					fscore: fnum(topNinja.repos.github.data.public_repos)
				}
			},
			gists: {
				sum: sums.gists,
				fsum: fnum(sums.gists),
				topNinja: {
					name: topNinja.gists.name,
					url: topNinja.gists.github.url,
					score: topNinja.gists.github.data.public_gists,
					fscore: fnum(topNinja.repos.github.data.public_gists)
				}
			},
			fNinjaCount: fnum(githubbers.size()),
			ninjaCount: githubbers.size()
		},
		twitter: {
			tweets: {
				sum: sums.tweets,
				fsum: fnum(sums.tweets),
				topNinja: {
					name: topNinja.tweets.name,
					url: topNinja.tweets.twitter.url,
					score: topNinja.tweets.twitter.data.statuses_count,
					fscore: fnum(topNinja.tweets.twitter.data.statuses_count)
				}
			},
			fNinjaCount: fnum(twitterers.size()),
			ninjaCount: twitterers.size()
		},
		so: {
			rep: {
				sum: sums.rep,
				fsum: fnum(sums.rep),
				topNinja: {
					name: topNinja.rep.name,
					url: topNinja.rep.so.url,
					score: topNinja.rep.so.data.reputation,
					fscore: fnum(topNinja.rep.so.data.reputation)
				}
			},
			fNinjaCount: fnum(stackers.size()),
			ninjaCount: stackers.size()
		},
		fNinjaCount: fnum(ninjas.length),
		ninjaCount: ninjas.length
	};
};

module.exports = function() {
	return ninjabook.requestNinjas().then(getTotals);
};