var basePath = '../../'
var models = require(basePath + 'models')
var Admin = models.Admin

function createAdmin () {
  return Admin
    .findOrCreate({
      where: { email: 'admin@sumome.com' },
      defaults: { password: Admin.generateHash('quizard') }
    })
    .catch(console.log)
}

exports.seed = createAdmin
