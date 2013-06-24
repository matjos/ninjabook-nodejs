var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var Q = require('q');

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

var requestScore = function(ninja) {
	var deferred = Q.defer();

	request(ninja.so.url, function(err, resp, body) {
		if (err) {
			deferred.reject(err);
			return;
		}
		var $ = cheerio.load(body);
		ninja.so.rep = $('.reputation a').text();
		deferred.resolve(ninja);
	});

	return deferred.promise;
};

var requestNinjas = function() {
	var deferred = Q.defer(), ninjas = [];
	
	request('http://tretton37.com/career/meet/', function(err, resp, body) {
		if (err) {
			deferred.reject(err);
			return;
		}

		var $ = cheerio.load(body);
		$('.meet-single-face-holder').each(function() {
			var $this = cheerio(this);
			ninjas.push(getNinja($this));
		});

		deferred.resolve(ninjas);
	});	
	
	return deferred.promise;
};

requestNinjas()
	.then(function(ninjas) {
		var soNinjas = [];
		_(ninjas)
			.filter(function(ninja) { return ninja.so.url; })
			.each(function(ninja) {
				soNinjas.push(requestScore(ninja));
			});
		return Q.all(soNinjas);
	})
	.then(function(ninjas) {
		_(ninjas)
			.sortBy(function(ninja) {
				return ninja.so.rep;
			})
			.each(function(ninja) {
				console.log(ninja.so.rep + '\t' + ninja.name);
			});
	});
