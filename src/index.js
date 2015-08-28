var app = require('./app')
var models = require('./models')
var port = process.env.PORT || 3000
app.set('port', port)
module.exports = models.sequelize.sync()
  .then(function () {
    app.listen(port, function () {})
  })
