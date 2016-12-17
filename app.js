// openshift
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
// end openshift */
var s = require('./server.js')();
var mongojs = require('mongojs');
var db = mongojs(mongoURL, ['data']);
// var db = mongojs("data");
s.get("/count", function(req, res) {
    db.collection("transmigration").count({}, function(err, docs) {
        res.text(docs.toString());
    });
});
s.get("/data", function(req, res) {
    db.collection("transmigration").find({}, function(err, docs) {
        res.json(docs);
    });
});
s.get("/data?", function(req, res, q) {
    db.collection("transmigration").find(q, function(err, docs) {
        res.json(docs);
    });
});
s.post("/submit", function(req, res, body) {
    var entry = JSON.parse(body);
    entry["logged-at"] = new Date().toISOString().substring(0,19).replace("T"," ");
    db.collection("transmigration").insert(entry, function(err, docs) {
        res.text("Saved");
    });
});
s.get("/", function(req, res) {
    res.html("OK");
});
s.listen(8080);
