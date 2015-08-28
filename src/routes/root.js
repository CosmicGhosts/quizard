var Promise = require('bluebird')
var uuid = require('node-uuid')
var extend = require('util')._extend
var helpers = require('./helpers')
var models = helpers.models
var User = models.User
var UserAnswer = models.UserAnswer

var QuestionsRepo = require('../repos/questions')
var questionIds = QuestionsRepo.questionIds
var getAnsweredQuestions = QuestionsRepo.getAnsweredQuestions
var getUnansweredQuestion = QuestionsRepo.getUnansweredQuestion

var _cache = {}
function getCache (token) { return _cache[token] }
function setCache (token, ids) {
  _cache[token] = ids
}

function populateQuestionCache (req, res, next) {
  var userToken = req.session.userToken
  if (!userToken) { return next() }

  var isPopulated = getCache(userToken)
  if (isPopulated) { return next() }

  return getAnsweredQuestions(userToken)
    .then(questionIds)
    .then(setCache.bind(null, userToken))
    .then(next.bind(null, null))
    .catch(next)
}

function renderQuestion (req, res) {
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

  return User
    .create({ userToken: userToken })
    .then(function (user) { next() })
    .catch(function (err) { next(err) })
}

function homePage (req, res) {
  var userToken = req.session.userToken
  var answredIds = getCache(userToken)

  return getUnansweredQuestion(answredIds)
    .then(function (question) {
      var data = { questions: [question] }
      return renderQuestion(req, res)(data)
    })
    .catch(function (err) {
      console.log(err)
    })
}

function saveUserAnswer (userToken, answerId) {
  var getUser = User.findOne({ where: { userToken: userToken } })
  var getUserAnswer = UserAnswer.create({ AnswerId: answerId })
  return Promise.all([getUser, getUserAnswer])
    .spread(function (user, userAnswer) {
      return user.setUserAnswers([userAnswer])
    })
}

function createUserAnswer (req, res) {
  var userToken = req.session.userToken
  var answerId = req.params.answerId
  var questionId = req.params.questionId

  getCache(userToken).push(Number(questionId))

  return saveUserAnswer(userToken, answerId)
    .then(function () {
      res.redirect('/')
    }).catch(function (err) {
      // Handle Fail Case: when UserAnswer is not saved
      console.log(err)
      res.redirect('/')
    })
}

module.exports = function (app) {
  app.use(createAnonymousUser)
  app.use(populateQuestionCache)
  app.get('/', homePage)
  app.post('/questions/:questionId/answers/:answerId', createUserAnswer)
}
