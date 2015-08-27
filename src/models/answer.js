module.exports = function (sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Answer.belongsTo(models.Question)
      }
    }
  })

  return Answer
}
