(function() {
  var HEADER, UI, ansiparse, app, async, ejs,
  express, forever, foreverUI, fs, _, pkg, spawn;
  express = require('express');
  async = require('async');
  fs = require('fs');
  forever = require('forever');
  _ = require('underscore');
  ansiparse = require('ansiparse');
  ejs = require('ejs');
  pkg = require('./package.json');
  spawn = require('child_process').spawn;

  process.on("uncaughtException", function(err) {
    return console.log("Caught exception: " + err);
  });

  foreverUI = (function() {

    function foreverUI() {}

    foreverUI.prototype.findProcessByUID = function(uid, cb) {
      return forever.list("", function(err, processes) {
        if (err) return cb(err, null);
        return cb(null, _.find(processes, function(o) {
          return o.uid === uid;
        }));
      });
    };

    foreverUI.prototype.findProcIndexByUID = function(uid, cb) {
      return forever.list("", function(err, processes) {
        var i;
        if (err) return cb(err, null);
        i = -1;
        while (processes[++i]) {
          if (processes[i].uid === uid) return cb(null, i);
        }
        return cb("Process '" + uid + "' not found", null);
      });
    };

    foreverUI.prototype.info = function(uid, cb) {
      return this.findProcessByUID(uid, function(err, proc) {
        if (err) return cb(err, null);
        if (!proc) return cb("Undefined proc", null);
        return async.map([proc.logFile, proc.outFile, proc.errFile].filter(function(s) {
          return s !== void 0;
        }), function(filename, cb) {
          return fs.readFile(filename, function(err, data) {
            var d;
            d = (data || '').toString().trim();
            if (!d || d === '\n') {
              return cb(null, [filename, 'Empty log']);
            } else {
              return cb(null, [filename, ansiparse(d)]);
            }
          });
        }, function(err, results) {
          return cb(err, results);
        });
      });
    };

    foreverUI.prototype.stop = function(uid, cb) {
      return this.findProcIndexByUID(uid, function(err, index) {
        if (err) return cb(err, null);
        return forever.stop(index).on('stop', function(res) {
          return cb(null, true);
        }).on('error', function(err) {
          return cb(err, null);
        });
      });
    };

    foreverUI.prototype.restart = function(uid, cb) {
      return this.findProcIndexByUID(uid, function(err, index) {
        if (err) return cb(err, null);
        return forever.restart(index).on('restart', function(res) {
          return cb(null, true);
        }).on('error', function(err) {
          return cb(err, null);
        });
      });
    };

    foreverUI.prototype.start = function(options, cb) {
      var startScriptParams = new Array();
      startScriptParams = decodeURIComponent(options).split(" ");
      Array.prototype.unshift.apply(startScriptParams, ["start"]);
      child = spawn("forever", startScriptParams);
      child.unref();
      return cb(null, this.child);
    };

    return foreverUI;

  })();

  UI = new foreverUI();
  app = express();

  HEADER = {
    'Content-Type': 'text/javascript'
  };

  app.configure(function () {
    app.engine('html', ejs.renderFile);
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
  });

  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure("production", function() {
    app.use(express.errorHandler());
  });

  app.set('view options', {
    layout: false
  });

  app.get('/', function(req, res) {
    return forever.list("", function(err, results) {
      return res.render('index.ejs', {
        process: results,
        version: pkg.version
      });
    });
  });

  app.get('/refresh/', function(req, res) {
    return forever.list("", function(err, results) {
      return res.send(JSON.stringify(results), HEADER, 200);
    });
  });

  app.get('/processes', function(req, res) {
    return forever.list("", function(err, results) {
      return res.send(JSON.stringify(results), HEADER, 200);
    });
  });

  app.get('/restart/:uid', function(req, res) {
    return UI.restart(req.params.uid, function(err, results) {
      if (err) {
        return res.send(JSON.stringify({
          status: 'error',
          details: err
        }), HEADER, 500);
      } else {
        return res.send(JSON.stringify({
          status: 'success',
          details: results
        }), HEADER, 200);
      }
    });
  });

  app.get('/stop/:uid', function(req, res) {
    return UI.stop(req.params.uid, function(err, results) {
      if (err) {
        return res.send(JSON.stringify({
          status: 'error',
          details: err
        }), HEADER, 500);
      } else {
        return res.send(JSON.stringify({
          status: 'success',
          details: results
        }), HEADER, 200);
      }
    });
  });

  app.get('/info/:uid', function(req, res) {
    return UI.info(req.params.uid, function(err, results) {
      if (err) {
        return res.send(JSON.stringify({
          status: 'error',
          details: err
        }), HEADER, 500);
      } else {
        return res.send(JSON.stringify({
          status: 'success',
          details: results
        }), HEADER, 200);
      }
    });
  });

  app.post('/addProcess', function(req, res) {
    return UI.start(req.body.args, function(err, results) {
      if (err) {
        return res.send(JSON.stringify({
          status: 'error',
          details: err
        }), HEADER, 500);
      } else {
        return res.send(JSON.stringify({
          status: 'success',
          details: results
        }), HEADER, 200);
      }
    });
  });

  app.listen(8085);

  console.log("Started: Forever web UI app server!!");
  console.log("Listening on localhost:8085");

}).call(this);
