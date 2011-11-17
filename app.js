(function() {
  var UI, app, async, express, forever, foreverUI, fs;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  express = require('express');
  async = require('async');
  fs = require('fs');
  forever = require('forever');
  foreverUI = (function() {
    function foreverUI() {
      this.foreverHome = process.env.HOME + '/.forever';
      this.configJson = this._readConfSync("" + this.foreverHome + "/config.json");
      this.pidsPath = this.configJson.pidPath;
    }
    foreverUI.prototype._readConfSync = function(filename) {
      var conf, data;
      data = fs.readFileSync(fs.realpathSync(filename), 'utf8');
      conf = {};
      if (!data) {
        return conf;
      }
      try {
        conf = JSON.parse(data);
      } catch (ignoreError) {
        return {};
      }
      return conf;
    };
    foreverUI.prototype.getInfo = function(pid, cb) {
      var out, proc;
      pid = parseInt(pid, 10);
      proc = this.process.filter(function(o) {
        return o.pid === pid;
      });
      if (proc.length !== 1) {
        return cb({});
      }
      proc = proc[0];
      out = '';
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
    };
    foreverUI.prototype.getProcess = function(cb) {
      this.process = [];
      return fs.readdir(this.pidsPath, __bind(function(err, files) {
        files.forEach(__bind(function(filename) {
          var _conf;
          if (filename.lastIndexOf('.fvr') === -1) {
            return false;
          }
          _conf = this._readConfSync("" + this.pidsPath + "/" + filename);
          _conf.id = _conf.pid;
          return this.process.push(_conf);
        }, this));
        return cb(this.process);
      }, this));
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
    return res.render('index.ejs', {
      process: UI.process
    });
  });
  app.get('/refresh/', function(req, res) {
    return UI.getProcess(function(process) {
      return res.send(JSON.stringify(process), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/processes', function(req, res) {
    return UI.getProcess(function() {
      return res.send(JSON.stringify(UI.process), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/restart/:pid', function(req, res) {
    return UI.restart(req.params.pid, function(res) {
      return res.send(JSON.stringify(res), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/stop/:pid', function(req, res) {
    return UI.stop(req.params.pid, function(res) {
      return res.send(JSON.stringify(res), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  app.get('/info/:pid', function(req, res) {
    return UI.getInfo(req.params.pid, function(infos) {
      return res.send(JSON.stringify(infos), {
        'Content-Type': 'text/javascript'
      }, 200);
    });
  });
  UI.getProcess(function() {
    console.log('Listening on 127.0.0.1:3000');
    return app.listen(8085, "127.0.0.1");
  });
}).call(this);
