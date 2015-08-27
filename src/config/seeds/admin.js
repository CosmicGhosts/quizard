var basePath = '../../'
var models = require(basePath + 'models')
var Admin = models.Admin

function complete () {
  process.exit()
}

// models.sequelize.sync({force:true})

Admin
  .findOrCreate({
    where: { email: 'admin@sumome.com' },
    defaults: { password: Admin.generateHash('quizard') }
  })
  .then(complete)
  .catch(console.log)
