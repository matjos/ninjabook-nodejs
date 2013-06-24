var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var Q = require('q');
var fileDb = require('./filedb');

var regexTwitterHandle = /=(.)*/gi;

var getTwitter = function($this) {
	var twitterUrl = $this.find('.twitter').attr('href'), twitter = {};
	
	twitter.url = twitterUrl;
	if (twitterUrl) {
		var match = regexTwitterHandle.exec(twitterUrl);
		if (match) {
			twitter.screenName = match[0].substring(1);
		}
	}
	
	return twitter;
};

var getStack = function($this) {
	var soUrl = $this.find('.so').attr('href'), so = {};
	
	so.url = soUrl;
	
	return so;
};

var getGithub = function($this) {
	var url = $this.find('.so').attr('href'), github = {};
	
	github.url = url;
	
	return github;	
};

var getNinja = function($this) {
	var ninja = {};
	ninja.name = $this.find('h2').text();
	
	ninja.twitter = getTwitter($this);
	ninja.so = getStack($this);
	ninja.github = getGithub($this);
	
	return ninja;
};

var requestNinjas = function() {
	var deferred = Q.defer(), ninjas = [];
	
	fileDb.load().then(
		function(loaded) {
			deferred.resolve(loaded);
		},
		function(reason) {
			// if no file is available to load, start scrapin'!
			request('http://tretton37.com/career/meet/', function(err, resp, body) {
				if (err) {
					deferred.reject(err);
					console.error(err);
					return;
				}

				var $ = cheerio.load(body);
				$('.meet-single-face-holder').each(function() {
					var $this = cheerio(this);
					ninjas.push(getNinja($this));
				});
				
				require('./stackoverflow').requestScores(ninjas).then(function() {
					deferred.resolve(ninjas);
				});
			});	
		});
	
	return deferred.promise;
};

requestNinjas()
	.then()
	.then(function(ninjas) {
		_(ninjas)
			.filter(function(ninja) {
				return ninja.so.rep;
			})
			.sortBy(function(ninja) {
				return ninja.so.rep;
			})
			.each(function(ninja) {
				console.log(ninja.so.rep + '\t' + ninja.name);
			});
	});
