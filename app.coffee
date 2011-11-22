express = require 'express'
async = require 'async'
fs = require 'fs'
forever = require 'forever'
_ = require 'underscore'

#todo
class foreverUI

  constructor: ->

  
  findProcessByUID: (uid, cb) ->
    forever.list("", (err, processes) ->

      if(err)
        return cb(null)
      
      cb(_.find(processes, (o) -> o.uid == uid))
    )
  
  findIndexByUID: (uid, cb) ->
    forever.list("", (err, processes) ->

      if(err)
        return cb(null)
      
      cb(_.find(processes, (o) -> o.uid == uid))
    )


  # Get process logs
  info: (uid, cb) ->

    @findProcessByUID(uid, (proc) ->

      async.map([proc.logFile, proc.outFile, proc.errFile].filter((s) -> s != undefined), (filename, cb) ->

        fs.readFile(filename, (err, data) ->
          d = data.toString().trim()

          if(!d || d == '\n')
            cb(null, [filename, 'Empty log'])
          else
            cb(null, [filename, data.toString()])
        )

      , (err, results) ->
        cb results
      )
    )
  stop: (uid, cb) ->

    @findProcessByUID(uid, (proc) ->
      
    )
    cb {}

  restart: (uid, cb) ->
    cb {}

UI = new foreverUI()

app = express.createServer()

app.configure ->
  app.use express.bodyParser()
  app.use express.cookieParser()
  app.register('.ejs', require('ejs'))
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
    res.send JSON.stringify(results), { 'Content-Type': 'text/javascript' }, 200
  )
    
)

app.get('/processes', (req, res) ->
  # Refresh process list (#todo use fs.watch instead)
  forever.list("", (err, results) ->
    res.send JSON.stringify(results), { 'Content-Type': 'text/javascript' }, 200
  )
)

app.get('/restart/:uid', (req, res) ->
  UI.restart req.params.uid, (res) ->
    res.send JSON.stringify(res), { 'Content-Type': 'text/javascript' }, 200
)

app.get('/stop/:uid', (req, res) ->
  UI.stop req.params.uid, (res) ->
    res.send JSON.stringify(res), { 'Content-Type': 'text/javascript' }, 200
)

app.get('/info/:uid', (req, res) ->
  UI.info req.params.uid, (infos) ->
    res.send JSON.stringify(infos), { 'Content-Type': 'text/javascript' }, 200    
)



#todo
app.listen 8085, "127.0.0.1"

console.log "Listening on 127.0.0.1:8085"
