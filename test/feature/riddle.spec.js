var extend = require('util')._extend
var featureHelper = require('./featureHelper')
var browser = featureHelper.browser
var models = featureHelper.models
var appLoaded = featureHelper.app
var Question = models.Question
var Answer = models.Answer
var UserAnswer = models.UserAnswer
var User = models.User

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

describe('Feature: Riddles', function () {
  before(function () { return appLoaded  })
  
  context('When an Apprenctice begins the gauntlet', function () {
    before(function () {
      return models.sequelize.sync({ force: true })
    })

    context('and with riddles in the gauntlet', function () {
      context('and these riddles have their answers', function () {
        before(function (done) {
          this.question = Question.create(question)
          this.question
            .then(createAnswerFor(answer1))
            .then(function () {
              User.findAll().then(function (users) {
                console.log(users)
                visitRoot(done)
              })
            })
        })

        after(function () {
          return models.sequelize.sync({ force: true })
        })

        it('will be presented with a riddle', function () {
          browser.assert.text('.question .question-title', question.title)
          browser.assert.text('.question .question-description', question.description)
        })

        it('will be allowed to choose an answer', function () {
          browser.assert.text('.answer .answer-description', answer1.description)
        })

        context('and the Apprenctice chooses an answer', function () {
          before(function (done) {
            var next = function () { done(null) }
            var answer = browser.query('.answer')
            answer.click()

            var userAnswer = User.findOne()
                  .then(function (user) {
                    return user.getUserAnswers()
                  })
                  .then(function (userAnswers) {
                    var userAnswer = userAnswers[0]
                    console.log(userAnswer)
                    return userAnswer
                  })

            this.userAnswer = userAnswer
            return userAnswer.then(next, done)
          })

          it('will have their choice remembered', function () {
            this.userAnswer.then(function (userAnswer) {
            })
          })
        })
      })

      context('and the riddle has a different answer', function () {
        before(function (done) {
          this.question = Question.create(question)
          this.question
            .then(createAnswerFor(answer2))
            .then(function () { visitRoot(done) })
        })

        after(function () {
          return models.sequelize.sync({ force: true })
        })

        it('will be allowed to choose an answer', function () {
          browser.assert.text('.answer .answer-description', answer2.description)
        })
      })
    })

    context('and with no riddles in the gaunlet', function () {
      before(function (done) { visitRoot(done) })

      it('will not be presented with a riddle', function () {
        browser.assert.text('.questions', '')
      })
    })
  })
})
