var s = require('./server.js')();
var Datastore = require('nedb');
var db = new Datastore( { filename: './data.db', autoload: true} );

s.get("/count", function(req, res) {
	db.count({}, function(err, docs) {
		res.text(docs.toString());
	});
});
s.get("/data", function(req, res) {
	db.find({}, function(err, docs) {
		res.json(docs);
	});
});
s.get("/data?", function(req, res, q) {
	db.find(q, function(err, docs) {
		res.json(docs);
	});
});
s.post("/submit", function(req, res, body) {
	var entry = JSON.parse(body);
	entry["logged-at"] = new Date().toISOString().substring(0,19).replace("T"," ");
	db.insert(entry, function(err, docs) {
		res.text("Saved");
	});
});
s.listen(process.env.PORT || 8080);