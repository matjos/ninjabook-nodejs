var request = require('request'), 
	zlib = require('zlib'), 
	fs = require('fs'), 
	Q = require('q'),
	_ = require('lodash'),
	jsonstream = require('JSONStream'),
	es = require('event-stream');

var buildUrls = function(ninjas) {
	var url = "https://api.stackexchange.com/2.1/users/";
	url += _.map(ninjas, function(ninja) { return ninja.so.id; }).join(';');
	url += "?order=desc&sort=reputation&site=stackoverflow";
	return url;
};

var get = function(ninjas) {
	var deferred = Q.defer();
	
	var headers = {
		'Accept-Encoding': 'gzip',
		'user-agent': "ninjabook"
	};

	var url = buildUrls(_.filter(ninjas, function(ninja) {
		return ninja.so.id;
	}));
	
	console.log("Requesting url " + url + " ...");
	request({url: url, 'headers': headers}, function(err) {
		if (err) {
			deferred.reject(err);
			console.error(err);
		}
	})
		.pipe(zlib.createGunzip())
		.pipe(jsonstream.parse('items'))
		.pipe(es.mapSync(function (data) {
			deferred.resolve(data);
		}));
	
	return deferred.promise;
};

var addSoData = function(ninjas) {
	return Q.allSettled([
		get(ninjas)
	]).then(function(results){
		var soData = results[0].value;
		
		var mapped = _.reduce(soData, function(result, item) {
			result[item.user_id] = item;
			return result;
		}, {});
		
		console.log("Found so data for " + soData.length + " profile(s).");
		
		_.each(ninjas, function(ninja) {
			if (!ninja.so.id) return;
			var data = mapped[ninja.so.id];
			if (!data) return;
			ninja.so.data = data;
		});
		
		return ninjas;
	});
};

module.exports = function(ninjas) {
	return addSoData(ninjas);
};