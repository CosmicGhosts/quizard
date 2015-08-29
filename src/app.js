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

// Assets Setup
app.use(express.static(__dirname + '/public'))

// Views Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Routes Setup
routes.root(app)
routes.elder(app, passport)
app.use(function(req, res, next) {
  res.status(404)
  res.render('404')
});

module.exports = app
