(function() {
  var UI, app, async, express, forever, foreverUI, fs, _;
  express = require('express');
  async = require('async');
  fs = require('fs');
  forever = require('forever');
  _ = require('underscore');
  foreverUI = (function() {
    function foreverUI() {}
    foreverUI.prototype.info = function(uid, cb) {
      return forever.list("", function(err, processes) {
        var proc;
        if (err) {
          return cb(null);
        }
        proc = _.find(processes, function(o) {
          return o.uid === uid;
        });
        console.log(proc);
        return async.map([proc.logFile, proc.outFile, proc.errFile].filter(function(s) {
          return s !== void 0;
        }), function(filename, cb) {
          return fs.readFile(filename, function(err, data) {
            var d;
            d = data.toString().trim();
            if (!d || d === '\n') {
              return cb(null, [filename, 'Empty log']);
            } else {
              return cb(null, [filename, data.toString()]);
            }
          });
        }, function(err, results) {
          return cb(results);
        });
      });
    };
    foreverUI.prototype.stop = function(cb) {
      return cb({});
    };
    foreverUI.prototype.restart = function(cb) {
      return cb({});
    };
    return foreverUI;
  })();
  UI = new foreverUI();
  app = express.createServer();
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.register('.ejs', require('ejs'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.methodOverride());
    return app.use(app.router);
  });
  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.use(express.static(__dirname + "/public"));
  });
  app.configure("production", function() {
    app.use(express.errorHandler());
    return app.use(express.static(__dirname + '/public', {
      maxAge: oneYear
    }));
  });
  app.set('view options', {
    layout: false
  });
  app.get('/', function(req, res) {
    return forever.list("", function(err, results) {
      return res.render('index.ejs', {
        process: results
      });
    });
  });
  app.get('/refresh/', function(req, res) {
    return forever.list("", function(err, results) {
      return res.send(JSON.stringify(results), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/processes', function(req, res) {
    return forever.list("", function(err, results) {
      return res.send(JSON.stringify(results), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/restart/:uid', function(req, res) {
    return UI.restart(req.params.uid, function(res) {
      return res.send(JSON.stringify(res), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/stop/:uid', function(req, res) {
    return UI.stop(req.params.uid, function(res) {
      return res.send(JSON.stringify(res), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/info/:uid', function(req, res) {
    return UI.info(req.params.uid, function(infos) {
      return res.send(JSON.stringify(infos), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.listen(8085, "127.0.0.1");
  console.log("Listening on 127.0.0.1:8085");
}).call(this);
