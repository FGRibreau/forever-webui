express = require 'express'
async = require 'async'
fs = require 'fs'
forever = require 'forever'
_ = require 'underscore'
ejs = require('ejs')

process.on "uncaughtException", (err) ->
  console.log "Caught exception: " + err

#todo
class foreverUI

  constructor: ->


  findProcessByUID: (uid, cb) ->
    forever.list("", (err, processes) ->

      return cb(err, null) if(err)

      cb(null, _.find(processes, (o) -> o.uid == uid))
    )

  findProcIndexByUID: (uid, cb) ->
    forever.list("", (err, processes) ->

      return cb(err, null) if err

      i = -1

      while processes[++i]

        if(processes[i].uid == uid)
          return cb(null, i)

      cb("Process '#{uid}' not found", null)
    )


  # Get process logs
  info: (uid, cb) ->

    @findProcessByUID(uid, (err, proc) ->

      return cb(err, null) if err

      return cb("Undefined proc", null) if !proc

      async.map([proc.logFile, proc.outFile, proc.errFile].filter((s) -> s != undefined), (filename, cb) ->

        fs.readFile(filename, (err, data) ->
          d = data.toString().trim()

          if(!d || d == '\n')
            cb(null, [filename, 'Empty log'])
          else
            cb(null, [filename, data.toString()])
        )

      , (err, results) ->
        cb err, results
      )
    )

  # stop a process by it's uid
  stop: (uid, cb) ->

    @findProcIndexByUID(uid, (err, index) ->

      return cb(err, null) if err

      forever.stop(index)
        .on('stop', (res) -> cb(null, true))
        .on('error', (err) -> cb(err, null))

    )

  # restart a process by it's uid
  restart: (uid, cb) ->

    @findProcIndexByUID(uid, (err, index) ->

      return cb(err, null) if err

      forever.restart(index)
        .on('restart', (res) ->

          cb(null, true)
        )
        .on('error', (err) -> cb(err, null))
    )

UI = new foreverUI()

app = express.createServer()

HEADER = { 'Content-Type': 'text/javascript' }

app.configure ->
  app.use express.bodyParser()
  app.use express.cookieParser()
  app.register('.ejs', ejs)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'html')
  app.use express.methodOverride()
  app.use app.router

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )
  app.use express.static(__dirname + "/public")

app.configure "production", ->
  app.use express.errorHandler()
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }))


app.set 'view options',
  layout: false


app.get('/', (req, res) ->
  forever.list("", (err, results) ->
    res.render('index.ejs', {process: results})
  )

)

app.get('/refresh/', (req, res) ->
  forever.list("", (err, results) ->
    res.send JSON.stringify(results), HEADER, 200
  )

)

app.get('/processes', (req, res) ->
  forever.list("", (err, results) ->
    res.send JSON.stringify(results), HEADER, 200
  )
)

#todo : refactoring needed here
app.get('/restart/:uid', (req, res) ->
  UI.restart req.params.uid, (err, results) ->
    if err
      res.send JSON.stringify(status:'error', details:err), HEADER, 500
    else
      res.send JSON.stringify(status:'success', details:results), HEADER, 200
)

app.get('/stop/:uid', (req, res) ->
  UI.stop req.params.uid, (err, results) ->
    if err
      res.send JSON.stringify(status:'error', details:err), HEADER, 500
    else
      res.send JSON.stringify(status:'success', details:results), HEADER, 200
)

app.get('/info/:uid', (req, res) ->
  UI.info req.params.uid, (err, results) ->
    if err
      res.send JSON.stringify(status:'error', details:err), HEADER, 500
    else
      res.send JSON.stringify(status:'success', details:results), HEADER, 200
)

#todo
app.listen 8085, "127.0.0.1"
console.log "Listening on 127.0.0.1:8085"
