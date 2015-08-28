var basePath = '../../'
var models = require(basePath + 'models')
var Question = models.Question
var Answer = models.Answer

function complete () { process.exit() }
// models.sequelize.sync({force:true})

function addAnswers (questions) {
  var answers = questions.map(function (question) {
    return Answer.create({
      description: 'Love',
      QuestionId: question.id
    })
  })

  return Promise.all(answers)
}

function createQuestion (question, answers) {
  Question.findOrCreate({ where: { title: 'What is the Meaning of Life?' } })
    .then(addAnswers)
    .then(complete)
    .catch(console.log)
}

createQuestion()