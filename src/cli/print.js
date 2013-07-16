var _ = require('lodash');

var ranked = function(ninjas, i_callback) {
	var i = 0, rankList = []; 

	ninjas.sortBy(function (ninja) { 
		return -i_callback(ninja); 
	}).each(function (ninja) {
		var previous = rankList[i];
		if (!previous) {
			rankList.push([ninja]);
		}
		else if(i_callback(previous[0]) === i_callback(ninja)) {
			previous.push(ninja);
		}
		else {
			rankList.push([ninja]);
			i++;
		}
	});
	
	return rankList;	
};

module.exports.ranked = function(ninjas, options, i_callback, p_callback) {
	var i = 1, twitterers = ranked(ninjas, i_callback);
	if (!p_callback) {
		p_callback = i_callback;
	}
	_(twitterers).first(options.top).each(function(ninjas) {
		var first = ninjas[0];
		var ninjaNames = _.map(ninjas, function(ninja) {
			return ninja.name;
		}).join(', ');
		console.log( (i++) + '.\t' + p_callback(first) + '\t' + ninjaNames);
	});
};