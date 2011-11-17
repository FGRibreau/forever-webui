express = require 'express'
async = require 'async'
fs = require 'fs'
forever = require 'forever'

#todo
class foreverUI

  constructor: ->
    #  ~/.forever/pids/
    #todo
    @foreverHome = process.env.HOME+'/.forever'

    @configJson = @_readConfSync("#{@foreverHome}/config.json")

    @pidsPath = @configJson.pidPath

    
  _readConfSync: (filename) ->
    data = fs.readFileSync(fs.realpathSync(filename), 'utf8')
    conf = {}

    return conf if(!data)
    
    try
      conf = JSON.parse(data)

    catch ignoreError
      return {}
    
    return conf

  # Get process logs
  getInfo: (pid, cb) ->

    pid = parseInt(pid, 10)

    proc = @process.filter((o) -> 
      o.pid == pid
    )

    return cb {} if proc.length != 1

    proc = proc[0]

    out = ''

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
    
    
  getProcess: (cb) ->

    @process = []

    fs.readdir @pidsPath, (err, files) =>

      # todo
      files.forEach((filename) =>
        return false if filename.lastIndexOf('.fvr') == -1

        _conf = @_readConfSync "#{@pidsPath}/#{filename}"
        _conf.id = _conf.pid

        @process.push _conf
      )

      cb @process
  
  stop: (cb) ->
    cb {}

  restart: (cb) ->
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
  res.render('index.ejs', { process: UI.process})
)

app.get('/refresh/', (req, res) ->
  UI.getProcess (process) ->
    res.send JSON.stringify(process), { 'Content-Type': 'text/javascript' }, 200
)

app.get('/processes', (req, res) ->
  # Refresh process list (#todo use fs.watch instead)
  UI.getProcess(() ->
    res.send JSON.stringify(UI.process), { 'Content-Type': 'text/javascript' }, 200
  )
)

app.get('/restart/:pid', (req, res) ->
  UI.restart req.params.pid, (res) ->
    res.send JSON.stringify(res), { 'Content-Type': 'text/javascript' }, 200
)

app.get('/stop/:pid', (req, res) ->
  UI.stop req.params.pid, (res) ->
    res.send JSON.stringify(res), { 'Content-Type': 'text/javascript' }, 200
)

app.get('/info/:pid', (req, res) ->
  UI.getInfo req.params.pid, (infos) ->
    res.send JSON.stringify(infos), { 'Content-Type': 'text/javascript' }, 200    
)


UI.getProcess(() ->
  console.log 'Listening on 127.0.0.1:3000'
  
  #todo
  app.listen 8085, "127.0.0.1"
)