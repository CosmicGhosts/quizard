/* eslint-env node, mocha */

var featureHelper = require('./featureHelper')
var browser = featureHelper.browser
var appLoaded = featureHelper.app

describe.skip('Feature: The Front Gates', function () {
  before(function () { return appLoaded })

  context('When an Apprenctice travels to the gates of our gauntlet', function () {
    before(function () { return browser.visit('/') })

    it('will see the banner of our Ward', function () {
      browser.assert.text('title', 'Behold Quizard!')
      browser.assert.text('.site-title', 'Quizard')
    })
  })
})
