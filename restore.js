var db = require('mongojs')(process.env.MONGODB_URI, ['transmigration']);
var json = JSON.parse(require('fs').readFileSync(process.argv[2]));
db.transmigration.remove({}, { multi: true }, function(err, numRemoved) {
	db.transmigration.insert(json, function(err, docs) {
		console.log('Done.');
	});
});