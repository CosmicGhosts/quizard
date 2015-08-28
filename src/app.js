var path          = require('path')
var express       = require('express')
var passport      = require('passport')
var bodyParser    = require('body-parser')
var cookieSession = require('cookie-session')

var setupPassport = require('./passport')
var routes        = require('./routes')
var models        = require('./models')
var app           = express()

// Session Setup
app.set('trust proxy', 1)
app.use(cookieSession({
  name: 'quizard-session',
  keys: ['magic']
}))

// Body Parser Setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Authentication Setup
setupPassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Routes Setup
routes.root(app)
routes.admin(app, passport)

// Views Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Assets Setup
app.use(express.static(__dirname + '/public'))

module.exports = app
