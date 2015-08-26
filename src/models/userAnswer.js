module.exports = function(sequelize, DataTypes) {
  var UserAnswer = sequelize.define('UserAnswer', {
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        UserAnswer.belongsTo(models.Answer)
      }
    }
  })

  return UserAnswer
}
