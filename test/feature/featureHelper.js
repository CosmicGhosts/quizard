process.env.NODE_ENV = 'test'
var port = process.env.PORT = 4000
var Browser = require('zombie')
Browser.localhost('quizard.com', port)
var browser = new Browser()

exports.browser = browser
exports.models = require('../../src/models')
exports.app = require('../../src')
