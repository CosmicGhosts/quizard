var uuid = require('node-uuid')
var extend = require('util')._extend
var basePath = '../'
var helpers = require('./helpers')
var QuestionCacher = require(basePath + 'modules/questionCacher')
var models = helpers.models
var Question = models.Question
var User = models.User
var UserAnswer = models.UserAnswer
var Answer = models.Answer
var QuestionCache = QuestionCacher({})

function getQuestion () {
  return Question
    .findOne({
      include: [Answer]
    })
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

  return models.User
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
  var userToken = req.session.userToken
  var questionId = req.params.questionId
  var answerId = req.params.answerId

  // Answered Question Caching
  // TODO: Extract to module
  QuestionCache.set(userToken, questionId)

  var getUser = User.find({ where: { userToken: userToken } })
  var getUserAnswer = UserAnswer.create({ AnswerId: answerId })

  // use spread
  var pendingAnswers = Promise.all([getUser, getUserAnswer]).then(function (values) {
    var user = values[0]
    var userAnswer = values[1]
    return user.setUserAnswers([userAnswer])
  })

  // Handle Fail Case: when UserAnswer is not saved
  return pendingAnswers
}

module.exports = function (app) {
  app.use(createAnonymousUser)
  app.get('/', homePage)
  app.post('/questions/:questionId/answers/:answerId', createUserAnswer)
}
