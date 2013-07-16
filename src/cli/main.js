var ninjabook = require('../ninjas');
var _ = require('lodash');
var S = require('string');
var program = require('commander');
var pjson = require('../../package.json');
var colors = require('colors');

var printHeader = function(header) {
	var hr = S('-').repeat(header.length).s;
	if (!program.nocolors) {
		header = header.green;
		hr = hr.green;
	}
	console.log(header);
	console.log(hr);
};

var processNinjas = function(header, printCallback) {
	var options = {
		top: (program.top ? program.top : 10)
	};
	ninjabook.requestNinjas()
		.then(function (ninjas) {
			printHeader(header);
			printCallback(ninjas, options);
		});
};

program
	.option('-t, --top <n>', 'Filter out the top <n> of list output', parseInt)
	.option('-c, --nocolors', 'Turn off cli colors')
	.version(pjson.version);

program.command('update')
	.description('Updates the Ninjabook')
	.action(function (){
		ninjabook.requestNinjas(true).done();
	});

program.command('stack')
	.description('Shows the StackOverflow rep highscore')
	.action(function (){
		processNinjas("StackOverflow Highscore", 
			require('./stackoverflow').printScores);
	});

program.command('stackweekly')
    .description('Shows the StackOverflow weekly rep highscore')
    .action(function (){
        processNinjas("StackOverflow Highscore",
            require('./stackoverflow').printWeeklyScores);
    });

program.command('stackvets')
	.description('Shows the StackOverflow veterans (ordered by id)')
	.action(function (){
		processNinjas("StackOverflow Veterans", 
			require('./stackoverflow').printIds);
	});

program.command('badges')
	.description('Shows the StackOverflow badge count')
	.action(function (){
		processNinjas("StackOverflow Badge Count Highscore", 
			require('./stackoverflow').printBadges);
	});

program.command('repos')
	.description('Ranks ninjas according to number of github repos')
	.action(function() {
		processNinjas("Number of Github Repos", 
			require('./github').printRepos);
	});

program.command('gists')
	.description('Ranks ninjas according to number of github gists')
	.action(function() {
		processNinjas("Number of Github Gists", 
			require('./github').printGists);
	});
	
program.command('peek <ninja>')
	.description('Peek into a ninja\'s public social media data')
	.action(function(ninja) {
		if (!ninja) {
			return;
		} 
		var ss = ninja.toLowerCase();
		ninjabook.requestNinjas()
			.then(function(ninjas) {
				_(ninjas).filter(function (ninja) {
					return S(ninja.name.toLowerCase()).contains(ss);
				}).each(function(ninja) {
					console.log((ninja.name + ":"));
					console.log(ninja);
				});
			});
	});

program.command('followers')
	.description('Ranks ninjas according to number of Twitter followers')
	.action(function() {
		processNinjas("Number of Twitter Followers", 
			require('./twitter').printFollowers);
	});

program.command('friends')
	.description('Ranks ninjas according to number of Twitter friends (that the ninja is following)')
	.action(function() {
		processNinjas("Ranked by Number of Twitter Friends (following)", 
			require('./twitter').printFriends);
	});

program.command('tweets')
	.description('Ranks ninjas according to number of tweets')
	.action(function() {
		processNinjas("Number of Tweets", 
			require('./twitter').printTweets);
	});

program.command('stalkers')
	.description('Ranks ninjas by stalk quotient (following/followers)')
	.action(function() {
		processNinjas("Most Stalking Ninjas According to Twitter (following/followers)", 
			require('./twitter').printStalkers);
	});

program.command('badass')
	.description('Ranks ninjas by badass quotient (followers/following)')
	.action(function () {
		processNinjas("Most Badass Ninjas According to Twitter (followers/following)",
			require('./twitter').printBadass);		
	});

program.command('totals')
	.description('Prompts company totals')
	.action(function() {
		processNinjas("tretton37 Scores", 
			require('./totals'));
	});

program.parse(process.argv);
