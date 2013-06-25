var cli = require('celeri');
var ninjabook = require('./ninjas');
var _ = require('lodash');
var S = require('string');

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
			console.log("StackOverflow Highscore".green);
			console.log("-----------------------".green);
			require('./stackoverflow').printScores(ninjas);
		});
});

cli.option({
	command: 'repos',
	description: 'Ranks according to number of github repos'
}, function() {
	ninjabook.requestNinjas()
		.then(function(ninjas) {
			console.log("Number of Github Repos".green);
			console.log("----------------------".green);
			require('./github').printRepos(ninjas);
		});
});

cli.option({
	command: 'gists',
	description: 'Ranks according to number of github gists'
}, function() {
	ninjabook.requestNinjas()
		.then(function(ninjas) {
			console.log("Number of Github Gists".green);
			console.log("----------------------".green);
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

cli.parse(process.argv);