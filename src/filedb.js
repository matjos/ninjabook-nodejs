var fs = require('fs'), dbfile = './db.json', twitterfile = './twitter_oauth.json';
var Q = require('q');

var saveJSON = function(json, file) {
	var deferred = Q.defer();
	console.log('Saving data file to ' + file);
	
	if (!json) {
		console.error(json);
		deferred.reject(new Error('input was undefined or null'));
		return deferred.promise;
	}

	fs.writeFile(file, JSON.stringify(json), function(err) {
		if(err) {
			console.error(err);
			deferred.reject(err);
			return;
		}

		console.log("The file was saved!");
		deferred.resolve(json);
	});
	
	return deferred.promise;
};

var loadJSON = function(file) {
	var deferred = Q.defer();
	
	fs.readFile(file, function(err, data) {
		if (err) {
			deferred.reject(err);
			return;
		}
		
		deferred.resolve(JSON.parse(data));
	});
	
	return deferred.promise;	
};

module.exports.loadJSON = loadJSON;
module.exports.saveJSON = saveJSON;

module.exports.save = function (json) {
	return saveJSON(json, dbfile);
};

module.exports.saveTwitterOauth = function(json) {
	return saveJSON(json, twitterfile);
};

module.exports.load = function() {
	return loadJSON(dbfile);
};

module.exports.loadTwitterOauth = function() {
	var promise = loadJSON(twitterfile);
	promise.fail(function() {
		console.log("Failed to load twitter oauth settings. Set them with `ninjabook twitterapi`");
	});
	return promise;
};