var s = require('./server.js')();
var db = require('mongojs')(process.env.MONGODB_URI, ['transmigration']);

s.get("/count", function(req, res) {
	db.transmigration.count({}, function(err, docs) {
		res.text(docs.toString());
	});
});
s.get("/data", function(req, res) {
	db.transmigration.find({}, function(err, docs) {
		res.json(docs);
	});
});
s.get("/data?", function(req, res, q) {
	db.transmigration.find(q, function(err, docs) {
		res.json(docs);
	});
});
s.post("/submit", function(req, res, body) {
	var entry = JSON.parse(body);
	entry["logged-at"] = new Date().toISOString().substring(0,19).replace("T"," ");
	db.transmigration.insert(entry, function(err, docs) {
		res.text("Saved");
	});
});
s.listen(process.env.PORT || 8080);