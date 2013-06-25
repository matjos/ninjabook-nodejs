var cli = require('celeri');
var ninjabook = require('./ninjas');
var _ = require('lodash');
var S = require('string');

var printHeader = function(header) {
	console.log(header.green);
	console.log(S('-').repeat(header.length).s.green);
};

cli.option({
	command: 'update',
	description: 'Updates the ninjabook'
}, function() {
	ninjabook.requestNinjas(true).done();
});

cli.option({
	command: 'stack',
	description: 'Shows the StackOverflow rep highscore'
}, function() {
	ninjabook.requestNinjas()
		.then(function (ninjas) {
			printHeader("StackOverflow Highscore");
			require('./stackoverflow').printScores(ninjas);
		});
});

cli.option({
	command: 'repos',
	description: 'Ranks ninjas according to number of github repos'
}, function() {
	ninjabook.requestNinjas()
		.then(function(ninjas) {
			printHeader("Number of Github Repos");
			require('./github').printRepos(ninjas);
		});
});

cli.option({
	command: 'gists',
	description: 'Ranks ninjas according to number of github gists'
}, function() {
	ninjabook.requestNinjas()
		.then(function(ninjas) {
			printHeader("Number of Github Gists");
			require('./github').printGists(ninjas);
		});
});

cli.option({
	command: 'peek :ninja',
	description: 'Peek into a ninja\'s public social media data'
}, function(data) {
	if (!data.ninja) {
		return;
	} 
	var ss = data.ninja.toLowerCase();
	ninjabook.requestNinjas()
		.then(function(ninjas) {
			_(ninjas).filter(function (ninja) {
				return S(ninja.name.toLowerCase()).contains(ss);
			}).each(function(ninja) {
				console.log((ninja.name + ":").green);
				console.log(ninja);
			});
		});
});

cli.option({
	command: 'followers',
	description: 'Ranks ninjas according to number of Twitter followers'
}, function() {
	printHeader("Number of twitter followers");
	ninjabook.requestNinjas()
		.then(require('./twitter').printFollowers);
});

cli.option({
	command: 'friends',
	description: 'Ranks ninjas according to number of Twitter friends (that the ninja is following)'
}, function() {
	printHeader("Number of twitter friends");
	ninjabook.requestNinjas()
		.then(require('./twitter').printFriends);
});

cli.option({
	command: 'tweets',
	description: 'Ranks ninjas according to number of Twitter followers'
}, function() {
	printHeader("Number of tweets");
	ninjabook.requestNinjas()
		.then(require('./twitter').printTweets);
});

cli.option({
	command: 'stalkers',
	description: 'Ranks ninjas by stalk quotient (following/followers)'
}, function() {
	printHeader("Most stalking (following/followers) ninjas");
	ninjabook.requestNinjas()
		.then(require('./twitter').printStalkers);
});

cli.option({
	command: 'twitterapi',
	description: 'Save twitter OAuth credentials'
}, function() {
	var o = {};
	cli.prompt('Consumer key: ', function(input) {
		o.consumer_key = input;
	});
	cli.prompt('Consumer secret: ', function(input) {
		o.consumer_secret = input;
	});
	cli.prompt('Access token: ', function(input) {
		o.oauth_token = input;
	});
	cli.prompt('Access token key: ', function(input) {
		o.oauth_token_secret = input;
		require('./filedb').saveTwitterOauth(o).then(function() {
			console.log('Saved twitter credentials');
			process.exit(0);
		});
	});
	cli.open();
});

cli.parse(process.argv);