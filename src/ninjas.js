var cheerio = require('cheerio');
var Q = require('q');
var request = require('request');

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

var scrapeNinjas = function(body) {
	var $ = cheerio.load(body), ninjas = [];
	$('.meet-single-face-holder').each(function() {
		var $this = cheerio(this);
		ninjas.push(getNinja($this));
	});
	return ninjas;
};

var scrapeAllNinjas = function() {
	var deferred = Q.defer();
	
	// if no file is available to load, start scrapin'!
	request('http://tretton37.com/career/meet/', function(err, resp, body) {
		if (err) {
			console.error(err);
			deferred.reject(err);
			return;
		}
		
		var ninjas = scrapeNinjas(body);
		
		require('./stackoverflow').requestScores(ninjas).then(function() {
			deferred.resolve(ninjas);
		});
	});	
	
	return deferred.promise;
};

module.exports.requestNinjas = function(forceUpdate) {
	var deferred = Q.defer(), fileDb = require('./filedb');
	
	if (forceUpdate) {
		scrapeAllNinjas().then(function(scrapedNinjas) {
			fileDb.save(scrapedNinjas);
			deferred.resolve(scrapedNinjas);
		});		
	} else {
		fileDb.load()
			.then(
				function(loadedNinjas) {
					deferred.resolve(loadedNinjas);
				}, 
				function() {
					scrapeAllNinjas().then(function(scrapedNinjas) {
						fileDb.save(scrapedNinjas);
						deferred.resolve(scrapedNinjas);
					}, function(reason) {
						console.error(reason);
						deferred.reject(reason);
					});
				});
		
	}
	
	return deferred.promise;
};
