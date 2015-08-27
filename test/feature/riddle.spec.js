/* eslint-env node, mocha */

var extend = require('util')._extend
var featureHelper = require('./featureHelper')
var browser = featureHelper.browser
var models = featureHelper.models
var appLoaded = featureHelper.app
var Question = models.Question
var Answer = models.Answer
// var UserAnswer = models.UserAnswer
// var User = models.User

var visitRoot = browser.visit.bind(browser, '/')

var question = {
  description: 'What is the meaning of life?',
  title: 'The Meaning of Life'
}

var answer1 = {
  description: 'Money'
}

var answer2 = {
  description: 'Love'
}

function createAnswerFor (answer) {
  return function (question) {
    var options = { QuestionId: question.id }
    return Answer.create(extend(options, answer))
  }
}

function cleanDb () {
  return models.sequelize.sync({ force: true })
}

function createQA (question, answer) {
  var pendingQuestion = Question.create(question)
  var pendingAnswer = Answer.create(answer)

  return Promise.all([pendingQuestion, pendingAnswer])
    .then(function (values) {
      var question = values[0]
      var answer = values[1]
      return question.setAnswers([answer])
    })
}

before(function () { return cleanDb() })

describe('Feature: Riddles', function () {
  before(function () { return appLoaded })

  context('When an Apprenctice begins the gauntlet', function () {
    before(function () {
      return Promise.resolve()
        .then(function () { return createQA(question, answer1) })
        .then(function () { return browser.visit('/') })
    })

    it('will be presented with a riddle', function () {
      browser.assert.text('.question .question-title', question.title)
      browser.assert.text('.question .question-description', question.description)
    })

    it('will be allowed to choose an answer', function () {
      browser.assert.text('.answer .answer-description', answer1.description)
    })

    context('and the Apprenctice chooses an answer', function () {
      it('will have their choice remembered')
    })
  })

  context.skip('and the riddle has a different answer', function () {
    before(function (done) {
      this.question = Question.create(question)
      this.question
        .then(createAnswerFor(answer2))
        .then(function () { visitRoot(done) })
    })

    after(function () { return cleanDb() })

    it('will be allowed to choose an answer', function () {
      browser.assert.text('.answer .answer-description', answer2.description)
    })
  })

  context.skip('and with no riddles in the gaunlet', function () {
    before(function (done) { visitRoot(done) })

    it('will not be presented with a riddle', function () {
      browser.assert.text('.questions', '')
    })
  })
})
