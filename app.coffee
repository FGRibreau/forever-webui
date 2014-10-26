(->
  HEADER = undefined
  UI = undefined
  ansiparse = undefined
  app = undefined
  async = undefined
  ejs = undefined
  express = undefined
  forever = undefined
  foreverUI = undefined
  fs = undefined
  _ = undefined
  pkg = undefined
  spawn = undefined
  express = require("express")
  async = require("async")
  fs = require("fs")
  forever = require("forever")
  _ = require("underscore")
  ansiparse = require("ansiparse")
  ejs = require("ejs")
  pkg = require("./package.json")
  spawn = require("child_process").spawn
  process.on "uncaughtException", (err) ->
    console.log "Caught exception: " + err

  foreverUI = (->
    foreverUI = ->
    foreverUI::findProcessByUID = (uid, cb) ->
      forever.list "", (err, processes) ->
        return cb(err, null)  if err
        cb null, _.find(processes, (o) ->
          o.uid is uid
        )


    foreverUI::findProcIndexByUID = (uid, cb) ->
      forever.list "", (err, processes) ->
        i = undefined
        return cb(err, null)  if err
        i = -1
        return cb(null, i)  if processes[i].uid is uid  while processes[++i]
        cb "Process '" + uid + "' not found", null


    foreverUI::info = (uid, cb) ->
      @findProcessByUID uid, (err, proc) ->
        return cb(err, null)  if err
        return cb("Undefined proc", null)  unless proc
        async.map [proc.logFile, proc.outFile, proc.errFile].filter((s) ->
          s isnt undefined
        ), ((filename, cb) ->
          fs.readFile filename, (err, data) ->
            d = undefined
            d = (data or "").toString().trim()
            if not d or d is "\n"
              cb null, [filename, "Empty log"]
            else
              cb null, [filename, ansiparse(d)]

        ), (err, results) ->
          cb err, results



    foreverUI::stop = (uid, cb) ->
      @findProcIndexByUID uid, (err, index) ->
        return cb(err, null)  if err
        forever.stop(index).on("stop", (res) ->
          cb null, true
        ).on "error", (err) ->
          cb err, null



    foreverUI::restart = (uid, cb) ->
      @findProcIndexByUID uid, (err, index) ->
        return cb(err, null)  if err
        forever.restart(index).on("restart", (res) ->
          cb null, true
        ).on "error", (err) ->
          cb err, null



    foreverUI::start = (options, cb) ->
      startScriptParams = new Array()
      startScriptParams = decodeURIComponent(options).split(" ")
      Array::unshift.apply startScriptParams, ["start"]
      child = spawn("forever", startScriptParams)
      child.unref()
      cb null, @child

    foreverUI
  )()
  UI = new foreverUI()
  app = express()
  HEADER = "Content-Type": "text/javascript"
  app.configure ->
    app.engine "html", ejs.renderFile
    app.set "views", __dirname + "/views"
    app.use express.static(__dirname + "/public")
    app.use express.bodyParser()
    app.use express.cookieParser()
    app.use express.methodOverride()
    app.use app.router

  app.configure "development", ->
    app.use express.errorHandler(
      dumpExceptions: true
      showStack: true
    )

  app.configure "production", ->
    app.use express.errorHandler()

  app.set "view options",
    layout: false

  app.get "/", (req, res) ->
    forever.list "", (err, results) ->
      res.render "index.ejs",
        process: results
        version: pkg.version



  app.get "/refresh/", (req, res) ->
    forever.list "", (err, results) ->
      res.send JSON.stringify(results), HEADER, 200


  app.get "/processes", (req, res) ->
    forever.list "", (err, results) ->
      res.send JSON.stringify(results), HEADER, 200


  app.get "/restart/:uid", (req, res) ->
    UI.restart req.params.uid, (err, results) ->
      if err
        res.send JSON.stringify(
          status: "error"
          details: err
        ), HEADER, 500
      else
        res.send JSON.stringify(
          status: "success"
          details: results
        ), HEADER, 200


  app.get "/stop/:uid", (req, res) ->
    UI.stop req.params.uid, (err, results) ->
      if err
        res.send JSON.stringify(
          status: "error"
          details: err
        ), HEADER, 500
      else
        res.send JSON.stringify(
          status: "success"
          details: results
        ), HEADER, 200


  app.get "/info/:uid", (req, res) ->
    UI.info req.params.uid, (err, results) ->
      if err
        res.send JSON.stringify(
          status: "error"
          details: err
        ), HEADER, 500
      else
        res.send JSON.stringify(
          status: "success"
          details: results
        ), HEADER, 200


  app.post "/addProcess", (req, res) ->
    UI.start req.body.args, (err, results) ->
      if err
        res.send JSON.stringify(
          status: "error"
          details: err
        ), HEADER, 500
      else
        res.send JSON.stringify(
          status: "success"
          details: results
        ), HEADER, 200

  port = process.env.FOREVER_UI_PORT || 8085
  app.listen port
  console.log "Listening on localhost:#{port}"
).call this
