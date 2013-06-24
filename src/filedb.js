var fs = require('fs'), file = './db.json';
var Q = require('q');

module.exports.save = function (json) {
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
		deferred.resolve();
	});
	
	return deferred.promise;
};

module.exports.load = function() {
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