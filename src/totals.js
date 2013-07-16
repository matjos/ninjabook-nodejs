module.exports = function(ninjas, options) {

	var data = require('./stats/totals')(ninjas);
	
	console.log(data.github.ninjaCount + ' ninjas uses Github');
	console.log('Total no. of public repos:\t', data.github.repos.sum, 'repos');
	console.log(' ', data.github.repos.topNinja.name, 
		'has the most with', 
		data.github.repos.topNinja.score, 
		"repos");
	console.log('Total no. of public gists:\t', data.github.gists.sum, 'gists');
	console.log(' ', data.github.gists.topNinja.name, 
		'has the most with', 
		data.github.gists.topNinja.score, 
		"gists");
		
	console.log(data.twitter.ninjaCount + ' ninjas uses Twitter');
	console.log('Total no. of tweets:\t\t', data.twitter.tweets.sum, 'tweets');
	console.log(' ', data.twitter.tweets.topNinja.name, 
		'has tweeted the most with', 
		data.twitter.tweets.topNinja.score, 
		"tweets");
	
	
	console.log(data.so.ninjaCount + ' ninjas uses StackOverflow');
	console.log('Total amount of rep:\t\t', data.so.rep.sum, 'points');
	console.log(' ', data.so.rep.topNinja.name, 
		'is the most reputable with', 
		data.so.rep.topNinja.score, 
		"points");
	
	
};