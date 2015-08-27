var path          = require('path')
var express       = require('express')
var passport      = require('passport')
var bodyParser    = require('body-parser')
var cookieSession = require('cookie-session')

var sessionConfig = require('./config/session.json')
var setupPassport = require('./passport')
var adminRoutes   = require('./adminRoutes')
var routes        = require('./routes')
var models        = require('./models')
var app           = express()

// Session Setup
app.set('trust proxy', 1)
app.use(cookieSession(sessionConfig))

// Body Parser Setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Authentication Setup
setupPassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Routes Setup
routes(app)
adminRoutes(app, passport)

// Views Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

module.exports = app
