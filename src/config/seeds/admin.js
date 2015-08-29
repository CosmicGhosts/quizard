var basePath = '../../'
var models = require(basePath + 'models')
var Admin = models.Admin

var admin = {
  email: 'elder@sumome.com',
  password: Admin.generateHash('quizard')
}

function createAdmin () {
  return Admin
    .findOrCreate({
      where: { email: admin.email },
      defaults: { password: admin.password }
    })
}

exports.seed = createAdmin
