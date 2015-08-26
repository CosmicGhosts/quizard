var express = require('express')
var router  = express.Router()

router.get('/', function (req, res) {
  res.render('index', {title: 'Behold Quizard!'})
})

module.exports = router
