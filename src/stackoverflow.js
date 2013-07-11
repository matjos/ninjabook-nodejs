var Q = require('q');
var _ = require('lodash');
var request = require('request');
var print = require('./print');
var loadSoData = require('./providers/so');
var moment = require('moment');

module.exports.requestScores = function(ninjas) {
	return loadSoData(ninjas);
};

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