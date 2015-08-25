var app = require('./app')
var port = process.env.PORT || 3000

app.set('port', port)
app.listen(port, function () {
  console.log('started on port: ' + port)
})
