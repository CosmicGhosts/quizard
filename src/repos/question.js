var models = require('../models')
var Question = models.Question
var Answer = models.Answer

exports.getQAs = function () {
  return Question.findAll({ include: [Answer] })
}
