var passportLocalSequelize = require('passport-local-sequelize')

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    email: DataTypes.STRING,
    pass_hash: DataTypes.STRING,
    pass_salt: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Admin.hasOne(models.User)
      }
    }
  })

  passportLocalSequelize.attachToUser(Admin, {
    usernameField: 'email',
    hashField: 'pass_hash',
    saltField: 'pass_salt'
  })

  return Admin
}
