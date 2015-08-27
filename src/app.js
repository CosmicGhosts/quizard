var express = require('express')
var cookieSession = require('cookie-session')
var uuid = require('node-uuid')
var path = require('path')
var passport = require('passport')
var routes = require('./routes')
var models = require('./models')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(passport.initialize())
app.use(passport.session())
passport.use(models.Admin.createStrategy())
passport.serializeUser(models.Admin.serializeUser())
passport.deserializeUser(models.Admin.deserializeUser())

app.set('trust proxy', 1)
app.use(cookieSession({
  name: 'quizard-session',
  secret: 'pertronum',
  keys: ['pertronum']
}))

app.use(createAnonymousUser)
app.use('/', routes)

function createAnonymousUser (req, res, next) {
  var newSession = req.session.isNew

  if (!newSession && req.session.userToken) {
    return next()
  }

  var userToken = uuid.v4()
  req.session.userToken = userToken
  models.User
    .create({ userToken: userToken })
    .then(function (user) { next() })
    .catch(function (err) { next(err) })
}

module.exports = app
