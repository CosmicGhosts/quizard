var express  = require('express')
var uuid = require('node-uuid')
var extend = require('util')._extend
var helpers  = require('./helpers')
var models   = helpers.models
var Question = models.Question
var User     = models.User
var UserAnswer = models.UserAnswer
var Answer = models.Answer

function getQuestion () {
  return Question
    .findOne({
      include: [Answer]
    })
}

function renderQuestion(req, res) {
  var defaults = { userToken: req.session.userToken }
  return function (data) {
    var newData = extend(data, defaults)
    res.render('home', newData)
  }
}

function createAnonymousUser (req, res, next) {
  var newSession = req.session.isNew
  if (!newSession && req.session.userToken) {
    return next()
  }

  var userToken = uuid.v4()
  req.session.userToken = userToken

  var pendingNewUser = models.User
        .create({ userToken: userToken })
        .then(function (user) { next() })
        .catch(function (err) { next(err) })
}

function homePage (req, res) {
  return getQuestion().then(function (question) {
    var data = { questions: [question] }
    return renderQuestion(req, res)(data)
  })
}

function createUserAnswer (req, res) {
  var userToken  = req.session.userToken
  var questionId = req.params.questionId
  var answerId   = req.params.answerId

  var getUser = User.find({ where: { userToken: userToken } })
  var getUserAnswer = UserAnswer.create({ AnswerId: answerId })

  // use spread
  return Promise.all([getUser, getUserAnswer]).then(function (values) {
    var user = values[0]
    var userAnswer = values[1]
    return user.setUserAnswers([userAnswer])
  })
}

module.exports = function (app) {
  app.use(createAnonymousUser)
  app.get('/', homePage)
  app.post('/questions/:questionId/answers/:answerId', createUserAnswer)
}
