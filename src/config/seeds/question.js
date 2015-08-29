var basePath = '../../'
var QuestionsRepo = require(basePath + 'repos/questions')

var questionData = [
  {
    question: {
      title: 'What is the Meaning of Life?'
    },
    answers: [
      { description: 'Love' },
      { description: 'Money' },
      { description: 'Power' },
      { description: 'Health' }
    ]
  },
  {
    question: {
      title: 'Free Tacos?'
    },
    answers: [
      { description: 'Yes' },
      { description: 'No' }
    ]
  },
  {
    question: {
      title: 'Which is the better Progamming Language?'
    },
    answers: [
      { description: 'Ruby' },
      { description: 'Javascript' },
      { description: 'Clojure' },
      { description: 'Haskell' }
    ]
  }
]

function seed () {
  var pendingQuestions = questionData.map(function (data) {
    return QuestionsRepo.createQAs(data.question, data.answers)
  })
  return Promise.all(pendingQuestions)
}

exports.seed = seed
