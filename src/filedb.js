var fs = require('fs'), file = './db.json';
var Q = require('q');

module.exports.save = function (json) {
	var deferred = Q.defer();

	fs.writeFile(file, JSON.stringify(json), function(err) {
		if(err) {
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