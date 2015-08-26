var Browser = require('zombie')
Browser.localhost('quizard.com', 3000)
var browser = new Browser()
var visitRoot = browser.visit.bind(browser, '/')

describe('Feature: The Front Gates', function () {
  context('When an Apprenctice travels to the gates of our gauntlet', function () {
    before(function (done) { visitRoot(done) })

    it('will see the banner of our Ward', function () {
      browser.assert.text('title', 'Behold Quizard!')
      browser.assert.text('.site-title', 'Quizard')
    })
  })
})
