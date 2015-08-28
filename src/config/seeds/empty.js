var basePath = '../../'
var models = require(basePath + 'models')

function complete () { process.exit() }

function forceCleanDb () {
  return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
      return models.sequelize.sync({ force: true })
    })
    .then(function(){
      return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function(){
      console.log('Database synchronised.')
      complete()
    }, function(err){
      console.log(err)
      complete()
    })
}

forceCleanDb()
