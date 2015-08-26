var passportLocalSequelize = require('passport-local-sequelize')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    pass_hash: DataTypes.STRING,
    pass_salt: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.UserAnswer)
      }
    }
  })

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'pass_hash',
    saltField: 'pass_salt'
  })

  return User
}
