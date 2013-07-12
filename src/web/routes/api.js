
var getTotalStats = require('../../stats/totals');

/*
 * GET ninjas.
 */
exports.list = function(req, res){
	getTotalStats().then(function(stats) {
		res.send(stats);
	});
};