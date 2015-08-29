var Promise = require('bluebird')
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

function firstQuestion (questions) {
  return questions[0]
}

function getUnansweredQuestion (answeredIds) {
  var baseQuery = {
    include: [Answer],
    order: [models.Sequelize.fn('Rand')]
  }
  var query = buildUnansweredQuery(baseQuery, answeredIds)
  return Question
    .findAll(query)
    .then(firstQuestion)
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

  return Question.findAll({ include: [answerInclude] })
}

function createQuestion (data) {
  return Question.create(data)
}

function getAnswerUserAnswerCount (answerId) {
  return UserAnswer.findAndCountAll({
    where: { 'AnswerId': answerId }
  })
}

function addUserAnswerCount (answer) {
  return getAnswerUserAnswerCount(answer.id)
    .then(function (countObj) {
      answer.UserAnswerCount = countObj.count
      return answer
    })
}

function addAnswerUserAnswerCount (question) {
  var pendingAnswers = question.Answers.map(addUserAnswerCount)
  return Promise.all(pendingAnswers)
    .then(function (answers) {
      question.Answers = answers
      return question
    })
}

function getStats () {
  return Question
    .findAll({ include: [Answer] })
    .then(function (questions) {
      var pendingQuestions = questions.map(addAnswerUserAnswerCount)
      return Promise.all(pendingQuestions)
    })
}

function addAnswers (question, answers) {
  var pendingAnswers = answers.map(function (answer) {
    return Answer.create(answer)
  })
  return Promise
    .all(pendingAnswers)
    .then(function (answers) {
      return question.setAnswers(answers)
    })
}

function createQAs (question, answers) {
  return Question
    .create(question)
    .then(function (question) {
      return addAnswers(question, answers)
    })
}

function destroyById (questionId) {
  return Question
    .findById(questionId)
    .then(function (question) {
      return question.destroy()
    })
}

exports.create = createQuestion
exports.getQAs = getQuestionWithAnswers
exports.getStats = getStats
exports.getAnsweredQuestions = getAnsweredQuestions
exports.getUnansweredQuestion = getUnansweredQuestion
exports.nullQuestion = nullQuestion
exports.questionIds = questionIds
exports.createQAs = createQAs
exports.destroyById = destroyById
