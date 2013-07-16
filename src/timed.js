var timedCall = function(pauseTime, callbacks, index) {
	if (index <= callbacks.length - 1) {
		callbacks[index].call();
		setTimeout(function() { 
			timedCall(pauseTime, callbacks, index+1);
		}, pauseTime);
	}
};
 
module.exports.throttle = function(callbacks, requestsPerMinute) {
	var pauseTime = 60000 / requestsPerMinute;
	timedCall(pauseTime, callbacks, 0);
};

var repeatCall = function(callback, minutes) {
	callback();
	return setTimeout(function() {
		repeatCall(callback, minutes);
	}, minutes);
};

module.exports.repeat = function(callback, minutes) {
	return repeatCall(callback, minutes);
};