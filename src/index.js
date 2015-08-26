var app = require('./app')
var models = require('./models')
var port = process.env.PORT || 3000

function startApp () {
  app.listen(port, function () {
    console.log('started on port: ' + port)
  })
}

app.set('port', port)
models.sequelize
  .sync()
  .then(startApp)
