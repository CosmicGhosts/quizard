var express = require('express')
var path = require('path')
var passport = require('passport')
var routes = require('./routes')
var models = require('./models')
var app = express()

app.use('/', routes)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(passport.initialize())
app.use(passport.session())
passport.use(models.User.createStrategy())
passport.serializeUser(models.User.serializeUser())
passport.deserializeUser(models.User.deserializeUser())

module.exports = app
