var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var ninjas = [];
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

var addNinja = function() {
	var $this = cheerio(this);
	var ninja = {};
	ninja.name = $this.find('h2').text();
	
	ninja.twitter = getTwitter($this);
	ninja.so = getStack($this);
	ninja.github = getGithub($this);
	
	ninjas.push(ninja);
};

var printSoScore = function(ninja) {
	request(ninja.so.url, function(err, resp, body) {
		var $ = cheerio.load(body);
		var rep = $('.reputation a').text();
		
		console.log(rep + '\t' + ninja.name);
	});
};

request('http://tretton37.com/career/meet/', function(err, resp, body) {
	if (err) {
		console.error(err);
	}
	
	var $ = cheerio.load(body);
	$('.meet-single-face-holder').each(addNinja);
	
	/*
	_(ninjas).each(function(ninja) {
		var logput = ninja.name;
		if (ninja.twitter.screenName) logput += '\t' + ninja.twitter.screenName;
		console.log(logput);
	});
	*/
	_(ninjas)
		.filter(function(ninja) { return ninja.so.url; })
		.each(printSoScore);
});	
