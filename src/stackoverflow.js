var Q = require('q');
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var print = require('./print');
var loadSoData = require('./providers/so');

module.exports.requestScores = function(ninjas) {
	return loadSoData(ninjas);
};

var getIntRep = function(ninja) {
	var rep = ninja.so.rep;
	var repInt = parseInt(rep.replace(/,/g, ''), 10);
	return repInt;
};

var filtered = function(ninjas) {
	return _(ninjas).filter(function(ninja) {
		return ninja.so.rep;
	});
};

module.exports.printScores = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return getIntRep(ninja);		
	});
};

module.exports.printIds = function(ninjas, options) {
	print.ranked(filtered(ninjas), options, function(ninja) {
		return -ninja.so.id;		
	}, function(ninja) {
		return ninja.so.id;
	});
};