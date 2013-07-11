var cheerio = require('cheerio');
var Q = require('q');
var request = require('request');
var _ = require('lodash');

var getTwitter = function($this) {
	var twitterUrl = $this.find('.twitter').attr('href'), twitter = {}, screenName;
	
	twitter.url = twitterUrl;
	if (twitter.url) {
		var match = /=(.)*/gi.exec(twitter.url);
		if (match) {
			screenName = match[0].substring(1);
		}
		twitter.screenName = screenName;
	}
	
	return twitter;
};

var getStack = function($this) {
	var soUrl = $this.find('.so').attr('href'), so = {};
	
	so.url = soUrl;
	
	return so;
};

var getGithub = function($this) {
	var url = $this.find('.github').attr('href'), github = {};
	
	if (url) {
		github.url = url;
		var match = /github.com\/(.)*$/gi.exec(url);
		if (match) {
			var username = match[0].substring(11);
			github.username = username;
			github.apiurl = "https://api.github.com/users/" + username;
		}
	}
	
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
	var deferred = Q.defer(), meetUrl = 'http://tretton37.com/career/meet/';
	
	// if no file is available to load, start scrapin'!
	console.log("Requesting: " + meetUrl + " ...");
	request(meetUrl, function(err, resp, body) {
		if (err) {
			console.error(err);
			deferred.reject(err);
			return;
		}
		
		var ninjas = scrapeNinjas(body);
		
		Q.allSettled([
				require('./stackoverflow').requestScores(ninjas),
				require('./github').requestInfo(ninjas),
				require('./twitter').requestData(ninjas)
			]).then(function() {
				deferred.resolve(ninjas);
			});
	});	
	
	return deferred.promise;
};

module.exports.requestNinjas = function (forceUpdate) {
	var deferred = Q.defer(), fileDb = require('./filedb');
	
	if (forceUpdate) {
		scrapeAllNinjas().then(fileDb.save);		
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
