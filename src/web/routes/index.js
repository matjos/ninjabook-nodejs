
/*
 * GET home page.
 */

var getTotalStats = require('../../stats/totals');

exports.index = function(req, res){
	getTotalStats().then(function(statsData) {
		res.render('index', { title: 'tretton37 Ninja Stats', data: statsData });
	});
};