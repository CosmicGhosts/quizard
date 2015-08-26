var express  = require('express')
var router   = express.Router()
var models   = require('./models')
var Question = models.Question

function renderIndex(res, data) {
  res.render('index', data)
}

function renderQuestions (res) {
  return function (questions) {
    renderIndex(res, { questions: questions })
  }
}

router.get('/', function (req, res) {
  Question
    .findAll()
    .then(renderQuestions(res))
})

module.exports = router
