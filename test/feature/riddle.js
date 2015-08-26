// process.env.NODE_ENV = 'test'

var Browser = require('zombie')
Browser.localhost('quizard.com', 3000)
var browser = new Browser()
var visitRoot = browser.visit.bind(browser, '/')

var question = {
  description: 'What is the meaning of life?',
  title: 'The Meaning of Life'
}
var questions = [question]

var models = require('../../src/models')
var Question = models.Question
var Answer = models.Answer
var UserAnswer = models.UserAnswer
var User = models.User

describe('Feature: Riddles', function () {
  context('When an Apprenctice begins the gauntlet', function () {
    context('and with riddles in the gauntlet', function () {
      beforeEach(function (done) {
        Question.bulkCreate(questions).then(function () {
          visitRoot(done)
        })
      })

      afterEach(function () {
        return models.sequelize.sync({ force: true })
      })

      it('will be presented with a riddle', function () {
        browser.assert.text('.question .question-title', question.title)
        browser.assert.text('.question .question-description', question.description)
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
