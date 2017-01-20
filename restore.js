var Datastore = require('nedb');
var db = new Datastore( { filename: './data.db', autoload: true} );
var json = JSON.parse(require('fs').readFileSync(process.argv[2]));
db.remove({}, { multi: true }, function(err, numRemoved) {
	db.insert(json, function(err, docs) {
		console.log('Done.');
	});
});