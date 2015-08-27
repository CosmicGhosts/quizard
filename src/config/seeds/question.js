var basePath = '../../'
var models = require(basePath + 'models')
var Question = models.Question

function complete () { process.exit() }
// models.sequelize.sync({force:true})

Question
  .findOrCreate({ where: { title: 'What is the Meaning of Life?' } })
  .then(complete)
  .catch(console.log)
