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

var _cache = {}

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

function populateQuestionCache (req, res, next) {
  var userToken = req.session.userToken
  if (!userToken) { return next() }

  var isPopulated = _cache[userToken]
  if (isPopulated) { return next() }

  return getAnsweredQuestions(userToken).then(function (questions) {
    var ids = questions.map(function (question) { return question.id })
    req.session.questionCache = true
    _cache[userToken] = ids
    next()
  })
}

function nullQuestion (question) {
  if (!question) {
    return {
      title: 'No Questions',
      description: 'There are no more questions',
      Answers: []
    }
  }

  return question
}

function getQuestion (userToken) {
  var query = {
    include: [Answer]
  }

  var answeredIds = _cache[userToken] || []
  if (!(answeredIds.length === 0)) {
    query['where'] = {
      id: {
        $notIn: answeredIds
      }
    }
  }
  
  return Question
    .findOne(query)
    .then(nullQuestion)
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
  var userToken = req.session.userToken
  return getQuestion(userToken).then(function (question) {
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
  _cache[userToken].push(Number(questionId))

  var getUser = User.findOne({ where: { userToken: userToken } })
  var getUserAnswer = UserAnswer.create({ AnswerId: answerId })

  // use spread
  var pendingAnswers = Promise.all([getUser, getUserAnswer]).then(function (values) {
    var user = values[0]
    var userAnswer = values[1]
    return user.setUserAnswers([userAnswer])
  })

  // Handle Fail Case: when UserAnswer is not saved
  return pendingAnswers.then(function () {
    res.redirect('/')
  }).catch(function (err) {
    res.redirect('/')
  })
}

module.exports = function (app) {
  app.use(createAnonymousUser)
  app.use(populateQuestionCache)
  app.get('/', homePage)
  app.post('/questions/:questionId/answers/:answerId', createUserAnswer)
}
