module.exports = function(sequelize, DataTypes) {
  var UserAnswer = sequelize.define('UserAnswer', {
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        UserAnswer.hasOne(models.Answer)
        UserAnswer.belongsTo(models.User)
      }
    }
  })

  return UserAnswer
}
