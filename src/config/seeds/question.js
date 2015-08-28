var basePath = '../../'
var QuestionsRepo = require(basePath + 'repos/questions')

var question =  {
  title: 'What is the Meaning of Life?'
}

var answers = [
  { description: 'Love' },
  { description: 'Money' },
  { description: 'Power' },
  { description: 'Health' }
]

function seed () {
  return QuestionsRepo.createQAs(question, answers)
}

exports.seed = seed
