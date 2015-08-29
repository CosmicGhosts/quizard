var helpers = require('./helpers')
var models = helpers.models
var Answer = models.Answer
var QuestionsRepo = require('../repos/questions')

function renderLogin (req, res) {
  res.render('elder/login')
}

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  return res.redirect('/elder/login')
}

function authLogin (passport) {
  return passport.authenticate('local-login', {
    failureRedirect: '/elder/login',
    successRedirect: '/elder'
  })
}

function getStats (req, res) {
  return QuestionsRepo
    .getStats()
    .then(function (questions) {
      res.render('elder/dashboard', { questions: questions })
    })
}

function getQuestions (req, res) {
  QuestionsRepo
    .getQAs()
    .then(function (questions) {
      res.render('elder/questions', {
        questions: questions
      })
    })
}

function createQuestion (req, res) {
  var pendingQuestion = QuestionsRepo.create({
    title: req.body.questionTitle,
    description: req.body.questionDescription
  })
  return pendingQuestion
    .then(function (question) {
      res.redirect('/elder/questions')
    })
}

function createAnswer (req, res) {
  var questionId = req.params.questionId
  var answerDescription = req.body.answerDescription
  return Answer
    .create({
      description: answerDescription,
      QuestionId: questionId
    })
    .then(function (answer) {
      res.redirect('/elder/questions')
    })
}

function destroyQuestion (req, res) {
  var questionId = req.params.questionId
  return QuestionsRepo
    .destroyById(questionId)
    .then(function () {
      res.redirect('/elder/questions')
    })
}

function destroyAnswer (req, res) {
  var answerId = req.params.answerId

  return Answer
    .findById(answerId)
    .then(function (answer) {
      return answer.destroy()
    })
    .then(function () {
      res.redirect('/elder/questions')
    })
}

module.exports = function (app, passport) {
  app.get('/elder', isLoggedIn, getStats)
  app.get('/elder/login', renderLogin)
  app.get('/elder/questions', isLoggedIn, getQuestions)
  app.post('/elder/login', authLogin(passport))
  app.post('/elder/questions/new', isLoggedIn, createQuestion)
  app.post('/elder/questions/:questionId/answers/new', isLoggedIn, createAnswer)
  app.post('/elder/questions/:questionId/delete', isLoggedIn, destroyQuestion)
  app.post('/elder/questions/:questionId/answers/:answerId/delete', isLoggedIn, destroyAnswer)
}
