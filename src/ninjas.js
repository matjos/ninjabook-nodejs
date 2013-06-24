var cheerio = require('cheerio');

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

module.exports.scrapeNinjas = function(body) {
	var $ = cheerio.load(body), ninjas = [];
	$('.meet-single-face-holder').each(function() {
		var $this = cheerio(this);
		ninjas.push(getNinja($this));
	});
	return ninjas;
};