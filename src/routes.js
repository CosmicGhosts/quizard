var express  = require('express')
var router   = express.Router()
var models   = require('./models')
var Question = models.Question
var User = models.User

function render (view) {
  return function (res, data) {
    res.render(view, data)
  }
}

var renderIndexView = render('index')
var renderUsersView = render('users')

function renderQuestions (res) {
  return function (questions) {
    renderIndexView(res, { questions: questions })
  }
}

function renderUsers (res) {
  return function (users) {
    renderUsersView(res, { users: users })
  }
}

router.get('/', function (req, res) {
  Question
    .findAll({ include: [{ model: models.Answer }] })
    .then(renderQuestions(res))
})

router.get('/users', function (req, res) {
  User
    .findAll({ include: [{ model: models.UserAnswer }] })
    .then(renderUsers(res))
})

router.put('/user/:userToken/question/:questionId/answer/:answerId', function (req, res) {
  var userToken = req.params.userToken
  var questionId = req.params.questionId
  var answerId = req.params.answerId
  var getUser = models.User.findOne({ where: { userToken: userToken } })
  var getUserAnswer = models.UserAnswer.create({ AnswerId: answerId })
  
  Promise.all([getUser, getUserAnswer]).then(function (values) {
    var user = values[0]
    var userAnswer = values[1]
    return user.setUserAnswer(userAnswer)
  })
})

module.exports = router
