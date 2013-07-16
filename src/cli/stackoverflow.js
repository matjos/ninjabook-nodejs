var Q = require('q');
var _ = require('lodash');
var request = require('request');
var print = require('./print');
var moment = require('moment');

var filtered = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.so.data;
	});
};

module.exports.printScores = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return ninja.so.data.reputation;		
	});
};

module.exports.printIds = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return -ninja.so.data.creation_date;		
	}, function(ninja) {
		var millis = ninja.so.data.creation_date*1000;
		return moment(millis).format();
	});
};

var badgeSum = function(ninja) {
	var badges = ninja.so.data.badge_counts;
	return badges.gold + badges.silver + badges.bronze;
};

module.exports.printBadges = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return badgeSum(ninja);
	});
};

module.exports.printWeeklyScores = function(ninjas, options) {
    print.ranked(filtered(ninjas), options, function(ninja) {
        return ninja.so.data.reputation_change_week;
    });
};