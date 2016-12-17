var http = require('http');
var StaticServer = require('node-static').Server;
var file = new StaticServer('./public');
const qs = require('querystring');

module.exports = function() {
    var v = {};
    v.handlers = {};
    v.get = function(path, handler) {
        v.handlers['GET'+path] = handler;
    };
    v.post = function(path, handler) {
        v.handlers['POST'+path] = handler;
    };
    v.listen = function(port) {
        server = http.createServer(function(req, res) {
            res.html = function(text) {
                res.writeHead(200, { "Content-Type" : "text/html" });
                res.end(text);
            };
            res.json = function(text) {
                res.writeHead(200, { "Content-Type" : "application/json" });
                res.end(JSON.stringify(text));
            };
            res.text = function(text) {
                res.writeHead(200, { "Content-Type" : "text/plain" });
                res.end(text);
            };
            var handler = v.handlers[req.method+req.url];
            if(handler) {
                switch(req.method) {
                    case 'POST':
                    case 'PUT':
                        var body = '';
                        req.on('data', function(data) {
                            body += data;
                        });
                        req.on('end', function() {
                            handler(req, res, body.toString());
                        });
                        break;
                    default:
                        handler(req, res);
                }
            } else if(req.url.includes("?")) {
                split = req.url.split("?");
                v.handlers[req.method+split[0]+"?"](req, res, qs.parse(split[1]));
            } else {
                file.serve(req, res, function(err) {
                    if(err) {
                        file.serveFile("/404.html", "404", {}, req, res);
                    }
                });
            }
        }).listen(port);
    };
    return(v);
};
