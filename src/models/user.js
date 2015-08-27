module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    userToken: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.UserAnswer)
      }
    }
  })

  return User
}
