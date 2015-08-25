/* eslint-env node, mocha */

// var chai = require('chai')
// var expect = chai.expect
var Browser = require('zombie')

Browser.localhost('quizard.com', 3000)

describe('Feature: The Front Gates', function () {
  var browser = new Browser()

  context('When a Apprenctice travels to the gates of our gauntlet', function () {
    before(function (done) {
      browser.visit('/', done)
    })

    it('will see the banner of Ward', function () {
      browser.assert.text('title', 'Behold! Quizard')
    })
  })
})
