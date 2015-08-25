var express = require('express')
var path = require('path')
var routes = require('./routes')
var app = express()

app.use('/', routes)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

module.exports = app
