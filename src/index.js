var app = require('./app')
var models = require('./models')
var port = process.env.PORT || 3000

function startApp () {
  var server = app.listen(port, function () {})
  return server
}

app.set('port', port)
var appSetup = models.sequelize
  .sync()
  .then(startApp)

module.exports = appSetup
