var cli = require('celeri');
var ninjabook = require('./ninjas');

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

cli.parse(process.argv);