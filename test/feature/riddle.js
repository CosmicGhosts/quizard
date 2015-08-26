var extend = require('util')._extend
var Browser = require('zombie')
Browser.localhost('quizard.com', 3000)
var browser = new Browser()
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

var models = require('../../src/models')
var Question = models.Question
var Answer = models.Answer
var UserAnswer = models.UserAnswer
var User = models.User

function createAnswerFor (answer) {
  return function (question) {
    var options = { QuestionId: question.id }
    return Answer.create(extend(options, answer))
  }
}

describe('Feature: Riddles', function () {
  context('When an Apprenctice begins the gauntlet', function () {
    context('and with riddles in the gauntlet', function () {
      beforeEach(function () {
        this.question = Question.create(question)
        return this.question
      })

      afterEach(function () {
        return models.sequelize.sync({ force: true })
      })

      context('and these riddles have their answers', function () {
        beforeEach(function (done) {
          this.question
            .then(createAnswerFor(answer1))
            .then(function () { visitRoot(done) })
        })

        it('will be presented with a riddle', function () {
          browser.assert.text('.question .question-title', question.title)
          browser.assert.text('.question .question-description', question.description)
        })

        it('will be allowed to choose an answer', function () {
          browser.assert.text('.answer .answer-description', answer1.description)
        })
      })

      context('and the riddle has a different answer', function () {
        beforeEach(function (done) {
          this.question
            .then(createAnswerFor(answer2))
            .then(function () { visitRoot(done) })
        })

        it('will be allowed to choose an answer', function () {
          browser.assert.text('.answer .answer-description', answer2.description)
        })
      })
    })

    context('and with no riddles in the gaunlet', function () {
      beforeEach(function (done) { visitRoot(done) })

      it('will not be presented with a riddle', function () {
        browser.assert.text('.questions', '')
      })
    })
  })
})
