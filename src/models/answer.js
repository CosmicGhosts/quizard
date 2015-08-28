module.exports = function (sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        var options = { onDelete: 'CASCADE' }
        Answer.belongsTo(models.Question)
        Answer.hasMany(models.UserAnswer, options)
      }
    }
  })

  return Answer
}
