module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    description: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Question.hasMany(models.Answer)
      }
    }
  })

  return Question
}
