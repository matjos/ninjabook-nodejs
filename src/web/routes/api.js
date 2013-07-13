var express = require('express');
var getTotalStats = require('../../stats/totals');

module.exports = function() {
	var app = express();
	
	app.get('/', function(req, res) {
		res.send({
			links: [
				{
					rel: 'totals',
					href: '/totals'
				}
			]
		});
	});
	
	app.get('/totals', function(req, res) {
		getTotalStats().then(function(stats) {
			res.send(stats);
		});		
	});
	
	return app;
}();
