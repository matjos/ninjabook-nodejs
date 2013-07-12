
var ninjabook = require('../../ninjas');

/*
 * GET ninjas.
 */
exports.list = function(req, res){
	//res.send(['lol']);
	ninjabook.requestNinjas().then(function(ninjas) {
		res.send(ninjas);
	});
};