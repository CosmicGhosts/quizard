var extend = require('util')._extend
var models = require('../models')
var Question = models.Question
var Answer = models.Answer
var UserAnswer = models.UserAnswer
var User = models.User

var _nullQuestion = {
  title: 'No Questions',
  description: 'There are no more questions',
  Answers: []
}

function isEmpty (xs) { return xs.length === 0 }

function buildUnansweredQuery (baseQuery, answeredIds) {
  var query = extend({}, baseQuery)
  if (!isEmpty(answeredIds)) {
    query['where'] = { id: { $notIn: answeredIds } }
  }
  return query
}

function nullQuestion (question) {
  if (!question) { return _nullQuestion }
  return question
}

function questionIds (questions) {
  return questions.map(function (question) {
    return question.id
  })
}

function getQuestionWithAnswers () {
  return Question.findAll({ include: [Answer] })
}

function getUnansweredQuestion (answeredIds) {
  var baseQuery = { include: [Answer] }
  var query = buildUnansweredQuery(baseQuery, answeredIds)
  return Question
    .findOne(query)
    .then(nullQuestion)
}

function getAnsweredQuestions (userToken) {
  var userInclude = {
    model: User,
    where: { userToken: userToken }
  }

  var userAnswerInclude = {
    model: UserAnswer,
    include: [userInclude]
  }

  var answerInclude = {
    model: Answer,
    include: [userAnswerInclude]
  }

  return Question.findAll({
    include: [answerInclude],
    order: [models.Sequelize.fn('RAND')]
  })
}

exports.getQAs = getQuestionWithAnswers
exports.getAnsweredQuestions = getAnsweredQuestions
exports.getUnansweredQuestion = getUnansweredQuestion
exports.nullQuestion = nullQuestion
exports.questionIds = questionIds
